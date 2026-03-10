"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import NewIncomeForm from "../../components/NewIncomeForm";
import { apiFetch } from "../../lib/api";
import { formatCurrency } from "../../lib/currency";

type Income = {
  id: number;
  description: string;
  amount: number;
  recurrenceType: "ONCE" | "MONTHLY";
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
};

type IncomeFilter = "ALL" | "MONTHLY" | "ONCE";

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
        color: dark ? "#ffffff" : "#475569",
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

export default function ReceitasPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<IncomeFilter>("ALL");

  async function loadIncomes() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/incomes");
      setIncomes(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as receitas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteIncome(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja excluir esta receita?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoadingId(id);

      await apiFetch(`/incomes/${id}`, {
        method: "DELETE",
      });

      await loadIncomes();
    } catch (err) {
      console.error(err);
      setError("Não foi possível excluir a receita.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  useEffect(() => {
    loadIncomes();
  }, []);

  const filteredIncomes = useMemo(() => {
    if (filter === "ALL") {
      return incomes;
    }

    return incomes.filter((income) => income.recurrenceType === filter);
  }, [incomes, filter]);

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
                <h1 style={{ margin: 0 }}>Receitas</h1>
                <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                  Gerencie as receitas do household ativo.
                </p>

                <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                  <FilterButton
                    label="Todas"
                    active={filter === "ALL"}
                    onClick={() => setFilter("ALL")}
                  />
                  <FilterButton
                    label="Recorrentes"
                    active={filter === "MONTHLY"}
                    onClick={() => setFilter("MONTHLY")}
                  />
                  <FilterButton
                    label="Únicas"
                    active={filter === "ONCE"}
                    onClick={() => setFilter("ONCE")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <ToolbarIconButton
                  title="Nova receita"
                  onClick={() => setShowModal(true)}
                  dark
                >
                  <PlusIcon />
                </ToolbarIconButton>

                <ToolbarIconButton
                  title="Recarregar receitas"
                  onClick={loadIncomes}
                >
                  <RefreshIcon />
                </ToolbarIconButton>
              </div>
            </div>

            {loading && <p>Carregando receitas...</p>}

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
                      <th style={{ padding: "16px" }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredIncomes.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "24px", textAlign: "center" }}>
                          {filter === "ALL" && "Nenhuma receita cadastrada."}
                          {filter === "MONTHLY" && "Nenhuma receita recorrente encontrada."}
                          {filter === "ONCE" && "Nenhuma receita única encontrada."}
                        </td>
                      </tr>
                    )}

                    {filteredIncomes.map((income) => {
                      const canDelete = deleteLoadingId !== income.id;

                      return (
                        <tr key={income.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "16px" }}>{income.description}</td>
                          <td style={{ padding: "16px" }}>
                            {formatCurrency(income.amount)}
                          </td>
                          <td style={{ padding: "16px" }}>
                            {income.recurrenceType === "MONTHLY" ? "Mensal" : "Única"}
                          </td>
                          <td style={{ padding: "16px" }}>{income.startDate}</td>
                          <td style={{ padding: "16px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <ActionButton
                                enabled={canDelete}
                                title={canDelete ? "Excluir receita" : "Excluindo receita..."}
                                onClick={() => handleDeleteIncome(income.id)}
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
          <NewIncomeForm
            onCreated={() => {
              setShowModal(false);
              loadIncomes();
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </AuthGuard>
  );
}