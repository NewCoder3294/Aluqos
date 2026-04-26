"use client";

import { toast } from "@/src/components/toast";

let nextKey = 1248;

export function fakeJiraCreate(project = "ENG"): string {
  const key = `${project}-${nextKey++}`;
  toast.success(`Created ${key} in Jira`, {
    description: "Tracked in your backlog.",
    icon: <JiraGlyph />,
  });
  return key;
}

export function JiraSendButton({
  label = "Update Jira",
  project = "ENG",
}: {
  label?: string;
  project?: string;
}) {
  return (
    <button
      onClick={() => fakeJiraCreate(project)}
      className="px-3 py-1.5 text-xs rounded border border-[--color-paper-edge] bg-white hover:border-[#0052cc] text-[--color-ink]"
    >
      <span className="inline-flex items-center gap-1.5"><JiraGlyph /> {label}</span>
    </button>
  );
}

function JiraGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0052cc" aria-hidden>
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zM17.363 5.736H5.785a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 18.363 18.22V6.74a1.005 1.005 0 0 0-1-1.004zM23.155 0H11.577a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 24.156 12.49V1.005A1.005 1.005 0 0 0 23.155 0z"/>
    </svg>
  );
}
