"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import { apiFetch } from "../../../lib/api";
import { formatCurrency } from "../../../lib/currency";
import {
  confirmPdfImport,
  ImportPreviewResponse,
  ImportedTransaction,
  ConfirmImportResponse,
} from "../../../lib/imports";
import { CheckSquare, Square, AlertTriangle } from "lucide-react";

type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH";
  currentBalance: number;
};

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 8L12 4L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 20H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
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

function ToolbarIconButton({
  title,
  onClick,
  children,
  dark = false,
  disabled = false,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  dark?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        border: dark ? "none" : "1px solid #e5e7eb",
        background: disabled ? "#d1d5db" : dark ? "#6366f1" : "#ffffff",
        color: dark ? "#ffffff" : "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: dark && !disabled ? "0 8px 18px rgba(99,102,241,0.22)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export default function ImportacaoPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<ImportedTransaction[]>([]);

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadAccounts() {
    try {
      setLoadingAccounts(true);
      const data = await apiFetch("/accounts");
      setAccounts(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as contas.");
    } finally {
      setLoadingAccounts(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  function getActiveHouseholdId() {
    const raw =
      localStorage.getItem("activeHouseholdId") ||
      localStorage.getItem("householdId");

    return raw ? Number(raw) : null;
  }

  async function handlePreviewImport() {
    try {
      setError("");
      setSuccessMessage("");
      setPreview(null);
      setSelectedItems([]);

      const householdId = getActiveHouseholdId();

      console.log("selectedAccountId", selectedAccountId);
      console.log("householdId", householdId);
      console.log("file", file);

      if (!householdId) {
        setError("Household ativo não encontrado.");
        return;
      }

      if (!selectedAccountId) {
        setError("Selecione uma conta.");
        return;
      }

      if (!file) {
        setError("Selecione um arquivo PDF.");
        return;
      }

      setLoadingPreview(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("householdId", String(householdId));
      formData.append("accountId", selectedAccountId);

      const token = localStorage.getItem("accessToken");

      console.log("token", localStorage.getItem("accessToken"));
      console.log("selectedAccountId", selectedAccountId);
      console.log("householdId", householdId);
      console.log("file", file?.name);

      const response = await fetch("http://localhost:8080/api/imports/pdf/preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("preview status", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("preview status", response.status);
        console.error("preview statusText", response.statusText);
        console.error("preview error body", text);
        throw new Error(`Falha ao gerar preview (${response.status}).`);
      }

      const data: ImportPreviewResponse = await response.json();
      console.log("preview response", data);

      setPreview(data);
      setSelectedItems(data.items);
    } catch (err) {
      console.error("preview exception", err);
      setError(err instanceof Error ? err.message : "Não foi possível gerar o preview da importação.");
    } finally {
      setLoadingPreview(false);
    }
  }

  function isSelected(item: ImportedTransaction) {
    return selectedItems.some(
      (selected) =>
        selected.rawLine === item.rawLine &&
        selected.transactionDate === item.transactionDate &&
        selected.amount === item.amount
    );
  }

  function toggleItem(item: ImportedTransaction) {
    const selected = isSelected(item);

    if (selected) {
      setSelectedItems((prev) =>
        prev.filter(
          (current) =>
            !(
              current.rawLine === item.rawLine &&
              current.transactionDate === item.transactionDate &&
              current.amount === item.amount
            )
        )
      );
      return;
    }

    setSelectedItems((prev) => [...prev, item]);
  }

  async function handleConfirmImport() {
    try {
      setError("");
      setSuccessMessage("");

      const householdId = getActiveHouseholdId();

      if (!householdId) {
        setError("Household ativo não encontrado.");
        return;
      }

      if (!preview) {
        setError("Nenhum preview disponível.");
        return;
      }

      if (!selectedAccountId) {
        setError("Selecione uma conta.");
        return;
      }

      if (selectedItems.length === 0) {
        setError("Selecione ao menos um item para importar.");
        return;
      }

      setLoadingConfirm(true);

      const response: ConfirmImportResponse = await confirmPdfImport({
        importId: preview.importId,
        targetAccountId: Number(selectedAccountId),
        targetHouseholdId: householdId,
        selectedItems,
      });

      setSuccessMessage(`Importação concluída com sucesso. ${response.importedCount} itens importados.`);
      setPreview(null);
      setSelectedItems([]);
      setFile(null);
      setSelectedAccountId("");
    } catch (err) {
      console.error(err);
      setError("Não foi possível confirmar a importação.");
    } finally {
      setLoadingConfirm(false);
    }
  }

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
            <h1 style={{ margin: 0 }}>Importação de PDF</h1>
            <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
              Envie uma fatura ou extrato em PDF para revisar e importar lançamentos.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <ToolbarIconButton
              title="Gerar preview"
              onClick={handlePreviewImport}
              dark
              disabled={loadingPreview || loadingAccounts}
            >
              <UploadIcon />
            </ToolbarIconButton>

            <ToolbarIconButton
              title="Recarregar contas"
              onClick={loadAccounts}
              disabled={loadingAccounts}
            >
              <RefreshIcon />
            </ToolbarIconButton>
          </div>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontWeight: 600 }}>
            {error}
          </p>
        )}

        {successMessage && (
          <p style={{ color: "#16a34a", fontWeight: 600 }}>
            {successMessage}
          </p>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                Conta destino
              </label>

              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                }}
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} — {formatCurrency(account.currentBalance)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                Arquivo PDF
              </label>

              <label
                htmlFor="pdf-upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: file ? "#111827" : "#6b7280" }}>
                  {file ? file.name : "Selecione um arquivo PDF"}
                </span>

                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "#f3f4f6",
                    fontWeight: 600,
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  Escolher arquivo
                </span>
              </label>

              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <button
              onClick={handlePreviewImport}
              disabled={
                loadingPreview ||
                loadingAccounts ||
                accounts.length === 0 ||
                !selectedAccountId ||
                !file
              }
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background:
                  loadingPreview || !selectedAccountId || !file
                    ? "#a5b4fc"
                    : "#6366f1",
                color: "white",
                fontWeight: 600,
                cursor:
                  loadingPreview || !selectedAccountId || !file
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loadingPreview ? "Gerando preview..." : "Pré-visualizar importação"}
            </button>
          </div>
        </div>

        {preview && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >

            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
              <h2 style={{ margin: "0 0 8px 0" }}>Preview da importação</h2>
              <p style={{ margin: 0, color: "#6b7280" }}>
                Arquivo: <strong>{preview.fileName}</strong> · Tipo: <strong>{preview.documentType}</strong> ·
                Itens encontrados: <strong>{preview.totalItems}</strong> ·
                Selecionados: <strong>{selectedItems.length}</strong>
              </p>

              {preview.warnings.length > 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    color: "#9a3412",
                  }}
                >
                  {preview.warnings.map((warning, index) => (
                    <div key={index}>{warning}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                          <button
                            type="button"
                            title="Selecionar todos"
                            onClick={() => preview && setSelectedItems(preview.items)}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "12px",
                              border: "1px solid #e5e7eb",
                              background: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <CheckSquare size={18} />
                          </button>

                          <button
                            type="button"
                            title="Limpar seleção"
                            onClick={() => setSelectedItems([])}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "12px",
                              border: "1px solid #e5e7eb",
                              background: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Square size={18} />
                          </button>
                        </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                  <th style={{ padding: "16px" }}>Sel.</th>
                  <th style={{ padding: "16px" }}>Data</th>
                  <th style={{ padding: "16px" }}>Descrição</th>
                  <th style={{ padding: "16px" }}>Valor</th>
                  <th style={{ padding: "16px" }}>Tipo</th>
                  <th style={{ padding: "16px" }}>Confiança</th>
                </tr>
              </thead>

              <tbody>
                {preview.items.map((item, index) => (
                  <tr
                    key={`${item.rawLine}-${index}`}
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        background: item.possibleDuplicate ? "#fff7ed" : "white",
                      }}
                  >
                    <td style={{ padding: "16px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={() => toggleItem(item)}
                      />
                    </td>
                    <td style={{ padding: "16px" }}>{item.transactionDate}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{item.description}</span>

                        {item.possibleDuplicate && (
                          <span
                            title="Possível item duplicado"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              color: "#d97706",
                            }}
                          >
                            <AlertTriangle size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>{formatCurrency(item.amount)}</td>
                    <td style={{ padding: "16px" }}>{item.type}</td>
                    <td style={{ padding: "16px" }}>{item.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ fontWeight: 600 }}>
              Total selecionado:{" "}
              {formatCurrency(
                selectedItems.reduce((sum, item) => sum + item.amount, 0)
              )}
            </div>

            <div
              style={{
                padding: "20px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleConfirmImport}
                disabled={loadingConfirm}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: loadingConfirm ? "#93c5fd" : "#2563eb",
                  color: "white",
                  fontWeight: 600,
                  cursor: loadingConfirm ? "not-allowed" : "pointer",
                }}
              >
                {loadingConfirm ? "Importando..." : "Importar selecionados"}
              </button>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}