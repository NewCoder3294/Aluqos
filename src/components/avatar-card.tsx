import { Serif } from "./serif";

export function AvatarCard({
  name,
  role,
  size = "md",
  status,
}: {
  name: string;
  role: string;
  size?: "sm" | "md";
  status?: React.ReactNode;
}) {
  const dim = size === "sm" ? "w-9 h-9 text-[14px]" : "w-11 h-11 text-[16px]";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${dim} rounded-full text-white grid place-items-center`}
        style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
      >
        <Serif>{name.charAt(0)}</Serif>
      </div>
      <div>
        <Serif className="text-[16px]">{name}</Serif>
        <div className="label">{role}</div>
        {status && <div className="mt-1">{status}</div>}
      </div>
    </div>
  );
}
