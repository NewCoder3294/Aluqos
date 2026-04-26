"use client";

import { useDropzone } from "react-dropzone";

export function Dropzone({
  onFiles,
  hint = "Drop files here, or paste a Notion URL",
  multiple = true,
}: {
  onFiles: (files: File[]) => void;
  hint?: string;
  multiple?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFiles,
    multiple,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-coral bg-paper-hi" : "border-paper-edge bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-[14px] text-ink-muted">{hint}</p>
      <p className="label mt-2">.pdf · .docx · .md · .txt</p>
    </div>
  );
}
