"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import ProjectionChart from "../../../components/ProjectionChart";
import { apiFetch } from "../../../lib/api";
import { formatCurrency } from "../../../lib/currency";

type ProjectionItem = {
  month: string;
  balance: number;
};

type ForecastExpense = {
  id: number;
  description: string;
  amount: number;
  dayOfMonth: number | null;
};

type ProjectionResponse = {
  currentBalance: number;
  projection: ProjectionItem[];
  forecastExpenses: ForecastExpense[];
};

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: "999px",
        border: active ? "1px solid #6366f1" : "1px solid #e5e7eb",
        background: active ? "#6366f1" : "#ffffff",
        color: active ? "#ffffff" : "#374151",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default function ProjecaoPage() {
  const [months, setMonths] = useState(6);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [projection, setProjection] = useState<ProjectionItem[]>([]);
  const [forecastExpenses, setForecastExpenses] = useState<ForecastExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjection(selectedMonths: number) {
    try {
      setLoading(true);
      setError("");

      const data: ProjectionResponse = await apiFetch(
        `/projection?months=${selectedMonths}`
      );

      setCurrentBalance(data.currentBalance);
      setProjection(data.projection);
      setForecastExpenses(data.forecastExpenses ?? []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a projeção financeira.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjection(months);
  }, [months]);

  return (
    <AuthGuard>
      <main className="page-container">
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>Projeção Financeira</h1>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
            Veja como seu saldo evoluirá nos próximos meses com base nas
            receitas e despesas recorrentes.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              minWidth: "240px",
            }}
          >
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              Saldo Atual
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                marginTop: "4px",
                color: currentBalance >= 0 ? "#16a34a" : "#dc2626",
              }}
            >
              {formatCurrency(currentBalance)}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {[3, 6, 12].map((m) => (
              <FilterButton
                key={m}
                label={`${m} meses`}
                active={months === m}
                onClick={() => setMonths(m)}
              />
            ))}
          </div>
        </div>

        {loading && <p>Carregando projeção...</p>}

        {error && (
          <p style={{ color: "#dc2626", fontWeight: 600 }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <ProjectionChart data={projection} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "20px 20px 0 20px" }}>
                  <h2 style={{ margin: 0, fontSize: "18px" }}>
                    Evolução do saldo
                  </h2>
                  <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                    Projeção mês a mês para os próximos {months} meses.
                  </p>
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "16px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                      <th style={{ padding: "16px" }}>Mês</th>
                      <th style={{ padding: "16px" }}>Saldo Projetado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projection.map((item) => (
                      <tr
                        key={item.month}
                        style={{ borderTop: "1px solid #e5e7eb" }}
                      >
                        <td style={{ padding: "16px" }}>{item.month}</td>
                        <td
                          style={{
                            padding: "16px",
                            fontWeight: 700,
                            color:
                              item.balance >= 0 ? "#16a34a" : "#dc2626",
                          }}
                        >
                          {formatCurrency(item.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "20px" }}>
                  <h2 style={{ margin: 0, fontSize: "18px" }}>
                    Despesas recorrentes
                  </h2>
                  <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                    Itens mensais considerados na projeção.
                  </p>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb" }}>
                  {forecastExpenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: index === 0 ? "none" : "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {expense.description}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280" }}>
                          {expense.dayOfMonth
                            ? `Todo dia ${expense.dayOfMonth}`
                            : "Recorrência mensal"}
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, color: "#ef4444" }}>
                        {formatCurrency(expense.amount)}
                        <span
                          style={{
                            color: "#6b7280",
                            fontWeight: 500,
                            marginLeft: "4px",
                            fontSize: "13px",
                          }}
                        >
                          / mês
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </AuthGuard>
  );
}