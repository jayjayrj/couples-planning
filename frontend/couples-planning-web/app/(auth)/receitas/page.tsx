"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import Modal from "../../../components/Modal";
import NewIncomeForm from "../../../components/NewIncomeForm";
import { apiFetch } from "../../../lib/api";
import { formatCurrency } from "../../../lib/currency";

type Income = {
  id: number;
  accountId: number | null;
  accountName: string | null;
  description: string;
  amount: number;
  recurrenceType: "ONCE" | "MONTHLY";
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
};

type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH";
  currentBalance: number;
};

type IncomeFilter = "ALL" | "MONTHLY" | "ONCE";

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 12A9 9 0 1 1 8 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3V9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
      }}
    >
      <rect x="5" y="7" width="14" height="13" rx="2" fill={enabled ? "#ef4444" : "#9ca3af"} />
      <path d="M9 4H15" stroke={enabled ? "#ef4444" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7H20" stroke={enabled ? "#ef4444" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
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
      title={title}
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
      title={title}
      onClick={onClick}
      disabled={!enabled}
      style={{
        border: "none",
        background: "transparent",
        cursor: enabled ? "pointer" : "not-allowed",
        padding: "6px",
        borderRadius: "999px",
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

export default function ReceitasPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<IncomeFilter>("ALL");

  async function loadIncomes() {
    try {
      setLoading(true);
      const data = await apiFetch("/incomes");
      setIncomes(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as receitas.");
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

  async function handleDeleteIncome(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta receita?")) return;

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
    loadAccounts();
  }, []);

  const filteredIncomes = useMemo(() => {
    if (filter === "ALL") return incomes;
    return incomes.filter((income) => income.recurrenceType === filter);
  }, [incomes, filter]);

  return (
    <AuthGuard>
      <main className="page-container">
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
              <FilterButton label="Todas" active={filter === "ALL"} onClick={() => setFilter("ALL")} />
              <FilterButton label="Recorrentes" active={filter === "MONTHLY"} onClick={() => setFilter("MONTHLY")} />
              <FilterButton label="Únicas" active={filter === "ONCE"} onClick={() => setFilter("ONCE")} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <ToolbarIconButton title="Nova receita" onClick={() => setShowModal(true)} dark>
              <PlusIcon />
            </ToolbarIconButton>

            <ToolbarIconButton title="Recarregar receitas" onClick={loadIncomes}>
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                  <th style={{ padding: "16px" }}>Descrição</th>
                  <th style={{ padding: "16px" }}>Conta</th>
                  <th style={{ padding: "16px" }}>Valor</th>
                  <th style={{ padding: "16px" }}>Recorrência</th>
                  <th style={{ padding: "16px" }}>Data Inicial</th>
                  <th style={{ padding: "16px" }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredIncomes.map((income) => {
                  const canDelete = deleteLoadingId !== income.id;

                  return (
                    <tr key={income.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "16px" }}>{income.description}</td>
                      <td style={{ padding: "16px" }}>{income.accountName ?? "-"}</td>
                      <td style={{ padding: "16px" }}>{formatCurrency(income.amount)}</td>
                      <td style={{ padding: "16px" }}>
                        {income.recurrenceType === "MONTHLY" ? "Mensal" : "Única"}
                      </td>
                      <td style={{ padding: "16px" }}>{income.startDate}</td>
                      <td style={{ padding: "16px" }}>
                        <ActionButton
                          enabled={canDelete}
                          title="Excluir receita"
                          onClick={() => handleDeleteIncome(income.id)}
                        >
                          <DeleteIcon enabled={canDelete} />
                        </ActionButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NewIncomeForm
            accounts={accounts}
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