import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ padding: "32px" }}>
          <h1 style={{ marginTop: 0, color: "#111827" }}>Dashboard</h1>
          <p style={{ color: "#6b7280" }}>
            Bem-vindo ao Couples Planning.
          </p>
        </main>
      </div>
    </div>
  );
}