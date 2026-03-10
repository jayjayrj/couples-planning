"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import NewExpenseForm from "../../components/NewExpenseForm";
import { apiFetch } from "../../lib/api";
import { formatCurrency } from "../../lib/currency";

type Expense = {
  id: number;
  accountId: number | null;
  accountName: string | null;
  description: string;
  amount: number;
  recurrenceType: "ONCE" | "MONTHLY";
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
  status: "PENDING" | "PAID";
};

type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH";
  currentBalance: number;
};

type ExpenseFilter = "ALL" | "PENDING" | "PAID";

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12A9 9 0 1 1 8 4.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3V9H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActionButton({
  children,
  enabled,
  title,
  onClick,
}: {
  children: React.ReactNode;
  enabled: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={!enabled}
      style={{
        border: "none",
        background: "transparent",
        cursor: enabled ? "pointer" : "not-allowed",
        padding: "6px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (enabled) {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

function PayIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        filter: enabled ? "none" : "grayscale(100%)",
        opacity: enabled ? 1 : 0.35,
        transition: "0.2s ease",
      }}
    >
      <circle cx="12" cy="12" r="10" fill={enabled ? "#22c55e" : "#9ca3af"} />
      <path
        d="M8 12.5L10.8 15.3L16.5 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        filter: enabled ? "none" : "grayscale(100%)",
        opacity: enabled ? 1 : 0.35,
        transition: "0.2s ease",
      }}
    >
      <rect
        x="5"
        y="7"
        width="14"
        height="13"
        rx="2"
        fill={enabled ? "#ef4444" : "#9ca3af"}
      />
      <path
        d="M9 4H15"
        stroke={enabled ? "#ef4444" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 7H20"
        stroke={enabled ? "#ef4444" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M10 10V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ToolbarIconButton({
  title,
  onClick,
  children,
  dark = false,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        border: dark ? "none" : "1px solid #e5e7eb",
        background: dark ? "#6366f1" : "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: dark ? "0 8px 18px rgba(99,102,241,0.22)" : "none",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 10px 20px rgba(99,102,241,0.28)"
          : "0 6px 14px rgba(15,23,42,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = dark
          ? "0 8px 18px rgba(99,102,241,0.22)"
          : "none";
      }}
    >
      {children}
    </button>
  );
}

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
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#f8fafc";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#ffffff";
        }
      }}
    >
      {label}
    </button>
  );
}

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<ExpenseFilter>("ALL");

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

  async function loadAccounts() {
    try {
      const data = await apiFetch("/accounts");
      setAccounts(data);
    } catch (err) {
      console.error(err);
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

  async function handleDeleteExpense(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja excluir esta despesa?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoadingId(id);

      await apiFetch(`/expenses/${id}`, {
        method: "DELETE",
      });

      await loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Não foi possível excluir a despesa.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  useEffect(() => {
    loadExpenses();
    loadAccounts();
  }, []);

  const filteredExpenses = useMemo(() => {
    if (filter === "ALL") {
      return expenses;
    }

    return expenses.filter((expense) => expense.status === filter);
  }, [expenses, filter]);

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
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <h1 style={{ margin: 0 }}>Despesas</h1>
                <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                  Gerencie as despesas do household ativo.
                </p>

                <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                  <FilterButton
                    label="Todas"
                    active={filter === "ALL"}
                    onClick={() => setFilter("ALL")}
                  />
                  <FilterButton
                    label="Pendentes"
                    active={filter === "PENDING"}
                    onClick={() => setFilter("PENDING")}
                  />
                  <FilterButton
                    label="Pagas"
                    active={filter === "PAID"}
                    onClick={() => setFilter("PAID")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <ToolbarIconButton
                  title="Nova despesa"
                  onClick={() => setShowModal(true)}
                  dark
                >
                  <PlusIcon />
                </ToolbarIconButton>

                <ToolbarIconButton
                  title="Recarregar despesas"
                  onClick={loadExpenses}
                >
                  <RefreshIcon />
                </ToolbarIconButton>
              </div>
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
                      <th style={{ padding: "16px" }}>Conta</th>
                      <th style={{ padding: "16px" }}>Valor</th>
                      <th style={{ padding: "16px" }}>Recorrência</th>
                      <th style={{ padding: "16px" }}>Data Inicial</th>
                      <th style={{ padding: "16px" }}>Status</th>
                      <th style={{ padding: "16px" }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "24px", textAlign: "center" }}>
                          {filter === "ALL" && "Nenhuma despesa cadastrada."}
                          {filter === "PENDING" && "Nenhuma despesa pendente encontrada."}
                          {filter === "PAID" && "Nenhuma despesa paga encontrada."}
                        </td>
                      </tr>
                    )}

                    {filteredExpenses.map((expense) => {
                      const canMarkAsPaid =
                        expense.status === "PENDING" && actionLoadingId !== expense.id;

                      const canDelete = deleteLoadingId !== expense.id;

                      return (
                        <tr key={expense.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "16px" }}>{expense.description}</td>
                          <td style={{ padding: "16px" }}>{expense.accountName ?? "-"}</td>
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
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <ActionButton
                                enabled={canMarkAsPaid}
                                title={
                                  expense.status === "PENDING"
                                    ? "Marcar como paga"
                                    : "Despesa já está paga"
                                }
                                onClick={() => handleMarkAsPaid(expense.id)}
                              >
                                <PayIcon enabled={canMarkAsPaid} />
                              </ActionButton>

                              <ActionButton
                                enabled={canDelete}
                                title={canDelete ? "Excluir despesa" : "Excluindo despesa..."}
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                <DeleteIcon enabled={canDelete} />
                              </ActionButton>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NewExpenseForm
            accounts={accounts}
            onCreated={() => {
              setShowModal(false);
              loadExpenses();
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </AuthGuard>
  );
}