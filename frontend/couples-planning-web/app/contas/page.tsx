import AuthGuard from "../../components/AuthGuard";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function ContasPage() {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <main style={{ padding: "32px" }}>
            <h1>Contas</h1>
            <p>Página em construção.</p>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}