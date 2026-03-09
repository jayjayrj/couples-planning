"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import SummaryCard from "../../components/SummaryCard";
import ProjectionChart from "../../components/ProjectionChart";
import { apiFetch } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";

type DashboardSummary = {
  currentBalance: number;
  totalMonthlyIncome: number;
  totalMonthlyExpense: number;
  projectedMonthEndBalance: number;
};

type ProjectionItem = {
  month: string;
  balance: number;
};

type ProjectionResponse = {
  currentBalance: number;
  projection: ProjectionItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projection, setProjection] = useState<ProjectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summaryData = await apiFetch("/dashboard/summary");
        const projectionData: ProjectionResponse = await apiFetch("/projection?months=6");

        setSummary(summaryData);
        setProjection(projectionData.projection);
      } catch (err) {
        setError("Não foi possível carregar os dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AuthGuard>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
          <Sidebar />

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Topbar />

            <main style={{ padding: "32px" }}>
              <h1 style={{ marginTop: 0, color: "#111827" }}>Dashboard</h1>

              {loading && <p>Carregando dados...</p>}

              {error && (
                <p style={{ color: "#dc2626", fontWeight: 600 }}>
                  {error}
                </p>
              )}

              {!loading && !error && summary && (
                <>
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
                      value={formatCurrency(summary.currentBalance)}
                      color="#16a34a"
                    />

                    <SummaryCard
                      title="Receitas do Mês"
                      value={formatCurrency(summary.totalMonthlyIncome)}
                      color="#22c55e"
                    />

                    <SummaryCard
                      title="Despesas do Mês"
                      value={formatCurrency(summary.totalMonthlyExpense)}
                      color="#ef4444"
                    />

                    <SummaryCard
                      title="Saldo Projetado"
                      value={formatCurrency(summary.projectedMonthEndBalance)}
                      color="#6366f1"
                    />
                  </div>

                  <ProjectionChart data={projection} />
                </>
              )}
            </main>
          </div>
        </div>
    </AuthGuard>

  );
}