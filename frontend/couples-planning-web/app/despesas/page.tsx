"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { apiFetch } from "../../lib/api";
import { formatCurrency } from "../../lib/currency";

type Expense = {
  id: number;
  description: string;
  amount: number;
  recurrenceType: "ONCE" | "MONTHLY";
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
  status: "PENDING" | "PAID";
};

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/expenses");
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as despesas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsPaid(id: number) {
    try {
      setActionLoadingId(id);

      await apiFetch(`/expenses/${id}/pay`, {
        method: "PATCH",
      });

      await loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Não foi possível marcar a despesa como paga.");
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <Sidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />

          <main style={{ padding: "32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h1 style={{ margin: 0 }}>Despesas</h1>
                <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                  Gerencie as despesas do household ativo.
                </p>
              </div>

              <button
                onClick={loadExpenses}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Recarregar
              </button>
            </div>

            {loading && <p>Carregando despesas...</p>}

            {error && (
              <p style={{ color: "#dc2626", fontWeight: 600 }}>
                {error}
              </p>
            )}

            {!loading && !error && (
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                      <th style={{ padding: "16px" }}>Descrição</th>
                      <th style={{ padding: "16px" }}>Valor</th>
                      <th style={{ padding: "16px" }}>Recorrência</th>
                      <th style={{ padding: "16px" }}>Data Inicial</th>
                      <th style={{ padding: "16px" }}>Status</th>
                      <th style={{ padding: "16px" }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: "24px", textAlign: "center" }}>
                          Nenhuma despesa cadastrada.
                        </td>
                      </tr>
                    )}

                    {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        style={{ borderTop: "1px solid #e5e7eb" }}
                      >
                        <td style={{ padding: "16px" }}>{expense.description}</td>
                        <td style={{ padding: "16px" }}>
                          {formatCurrency(expense.amount)}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {expense.recurrenceType === "MONTHLY" ? "Mensal" : "Única"}
                        </td>
                        <td style={{ padding: "16px" }}>{expense.startDate}</td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              background:
                                expense.status === "PAID" ? "#dcfce7" : "#fee2e2",
                              color:
                                expense.status === "PAID" ? "#166534" : "#991b1b",
                            }}
                          >
                            {expense.status === "PAID" ? "Paga" : "Pendente"}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          {expense.status === "PENDING" ? (
                            <button
                              onClick={() => handleMarkAsPaid(expense.id)}
                              disabled={actionLoadingId === expense.id}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#6366f1",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              {actionLoadingId === expense.id
                                ? "Salvando..."
                                : "Marcar como paga"}
                            </button>
                          ) : (
                            <span style={{ color: "#6b7280" }}>Sem ação</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}