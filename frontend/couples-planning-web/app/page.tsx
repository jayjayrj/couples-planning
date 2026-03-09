import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SummaryCard from "../components/SummaryCard"

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ padding: "32px" }}>
          <h1 style={{ marginTop: 0, color: "#111827" }}>Dashboard</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <SummaryCard
              title="Saldo Atual"
              value="R$ 5.000"
              color="#16a34a"
            />

            <SummaryCard
              title="Receitas do Mês"
              value="R$ 8.000"
              color="#22c55e"
            />

            <SummaryCard
              title="Despesas do Mês"
              value="R$ 2.500"
              color="#ef4444"
            />

            <SummaryCard
              title="Saldo Projetado"
              value="R$ 5.500"
              color="#6366f1"
            />
          </div>
        </main>
      </div>
    </div>
  );
}