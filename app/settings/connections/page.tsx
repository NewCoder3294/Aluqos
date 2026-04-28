import { listConnections } from "@/src/connections/queries";
import { DEMO_USER_ID, MOCK_MODE } from "@/src/db/client";
import { ConnectionsView } from "./connections-view";

export default async function ConnectionsPage() {
  const connections = MOCK_MODE ? [] : await listConnections(DEMO_USER_ID);
  return <ConnectionsView initialConnections={connections} />;
}
