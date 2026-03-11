"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import Modal from "../../../components/Modal";
import NovaContaForm from "../../../components/NovaContaForm";
import { apiFetch } from "../../../lib/api";
import { formatCurrency } from "../../../lib/currency";

type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD";
  currentBalance: number;
};

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

function getAccountTypeLabel(type: Account["type"]) {
  switch (type) {
    case "CHECKING":
      return "Conta corrente";
    case "SAVINGS":
      return "Poupança";
    case "CREDIT_CARD":
      return "Cartão de crédito";
    default:
      return type;
  }
}

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function loadAccounts() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/accounts");
      setAccounts(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as contas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja excluir esta conta?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoadingId(id);

      await apiFetch(`/accounts/${id}`, {
        method: "DELETE",
      });

      await loadAccounts();
    } catch (err) {
      console.error(err);
      setError("Não foi possível excluir a conta.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

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
            <h1 style={{ margin: 0 }}>Contas</h1>
            <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
              Gerencie as contas do household ativo.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <ToolbarIconButton
              title="Nova conta"
              onClick={() => setShowModal(true)}
              dark
            >
              <PlusIcon />
            </ToolbarIconButton>

            <ToolbarIconButton
              title="Recarregar contas"
              onClick={loadAccounts}
            >
              <RefreshIcon />
            </ToolbarIconButton>
          </div>
        </div>

        {loading && <p>Carregando contas...</p>}

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
                      <th style={{ padding: "16px" }}>Nome</th>
                      <th style={{ padding: "16px" }}>Tipo</th>
                      <th style={{ padding: "16px" }}>Saldo Atual</th>
                      <th style={{ padding: "16px" }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {accounts.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "24px", textAlign: "center" }}>
                          Nenhuma conta cadastrada.
                        </td>
                      </tr>
                    )}

                    {accounts.map((account) => {
                      const canDelete = deleteLoadingId !== account.id;

                      return (
                        <tr key={account.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "16px" }}>{account.name}</td>
                          <td style={{ padding: "16px" }}>
                            {getAccountTypeLabel(account.type)}
                          </td>
                          <td style={{ padding: "16px" }}>
                            {formatCurrency(account.currentBalance)}
                          </td>
                          <td style={{ padding: "16px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <ActionButton
                                enabled={canDelete}
                                title={canDelete ? "Excluir conta" : "Excluindo conta..."}
                                onClick={() => handleDeleteAccount(account.id)}
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

                  {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                      <NovaContaForm
                        onCreated={() => {
                          setShowModal(false);
                          loadAccounts();
                        }}
                        onCancel={() => setShowModal(false)}
                      />
                    </Modal>
                  )}
                </AuthGuard>
              );
}