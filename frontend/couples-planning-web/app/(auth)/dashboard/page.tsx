"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import SummaryCard from "../../../components/SummaryCard";
import ProjectionChart from "../../../components/ProjectionChart";
import { apiFetch } from "../../../lib/api";

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

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projection, setProjection] = useState<ProjectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const summaryData: DashboardSummary = await apiFetch("/dashboard/summary");
        const projectionData: ProjectionResponse = await apiFetch("/projection?months=6");

        setSummary(summaryData);
        setProjection(projectionData.projection);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AuthGuard>
      <main className="page-container">
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Dashboard</h1>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
            Visão geral da saúde financeira do household ativo.
          </p>
        </div>

        {loading && <p>Carregando dados...</p>}

        {error && (
          <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
        )}

        {!loading && !error && summary && (
          <>
            <div className="dashboard-cards-grid">
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
                title="Saldo do Mês"
                value={formatCurrency(summary.projectedMonthEndBalance)}
                color="#6366f1"
              />
            </div>

            <section className="dashboard-chart-panel">
              <ProjectionChart data={projection} />
            </section>
          </>
        )}
      </main>
    </AuthGuard>
  );
}