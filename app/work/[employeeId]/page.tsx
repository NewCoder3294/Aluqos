import { redirect } from "next/navigation";

// V1 has a single primary employee (Alex). The dashboard is now a top-level
// route; the per-employee dashboard URL just bounces over so old links keep
// working without leaking the demo UUID into the address bar.
export default function WorkPage() {
  redirect("/dashboard");
}
