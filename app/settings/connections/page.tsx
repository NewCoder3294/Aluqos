import { listConnections } from "@/src/connections/queries";
import { DEMO_USER_ID } from "@/src/db/client";
import { ConnectionsView } from "./connections-view";

export default async function ConnectionsPage() {
  const connections = await listConnections(DEMO_USER_ID);
  return <ConnectionsView initialConnections={connections} />;
}
