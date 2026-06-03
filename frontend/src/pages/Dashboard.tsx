import { Header } from "../components/Header";
import { RobotsTable } from "../components/RobotsTable";
import { SystemStatus } from "../components/SystemStatus";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        <Header />
        <RobotsTable />
      </div>

      <div style={{ flex: 1 }}>
        <SystemStatus />
      </div>

    </div>
  );
}