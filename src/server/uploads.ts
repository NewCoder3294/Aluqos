"use server";

import { serverClient } from "@/src/db/client";
import { parseUpload } from "@/src/parsing/parse-upload";
import { randomUUID } from "node:crypto";

export type StoredUpload = {
  id: string;
  filename: string;
  storage_path: string;
  parsed_text: string;
};

export async function storeAndParseUpload(
  employeeId: string,
  file: { name: string; type: string; data: ArrayBuffer },
): Promise<StoredUpload> {
  const sb = serverClient();
  const buf = Buffer.from(file.data);
  const path = `${employeeId}/${randomUUID()}-${file.name}`;

  await sb.storage.from("uploads").upload(path, buf, { contentType: file.type, upsert: false });

  const parsed = await parseUpload(buf, file.type, file.name);

  const { data, error } = await sb
    .from("uploads")
    .insert({
      employee_id: employeeId,
      filename: file.name,
      storage_path: path,
      mime_type: file.type,
      parsed_text: parsed,
      parse_status: parsed ? "done" : "failed",
    })
    .select()
    .single();
  if (error) throw error;
  return { id: data.id, filename: data.filename, storage_path: data.storage_path, parsed_text: data.parsed_text };
}
