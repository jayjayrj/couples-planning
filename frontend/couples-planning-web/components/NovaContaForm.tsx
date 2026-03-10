"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

type AccountType = "CHECKING" | "SAVINGS" | "CREDIT_CARD";

type NovaContaFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export default function NovaContaForm({
  onCreated,
  onCancel,
}: NovaContaFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("CHECKING");
  const [initialBalance, setInitialBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome da conta.");
      return;
    }

    if (initialBalance === "" || Number.isNaN(Number(initialBalance))) {
      setError("Informe um saldo inicial válido.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiFetch("/accounts", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          type,
          initialBalance: Number(initialBalance),
        }),
      });

      onCreated();
    } catch (err) {
      console.error(err);
      setError("Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: "420px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "22px" }}>Nova conta</h2>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
          Cadastre uma conta financeira para o household ativo.
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <div>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ex.: Nubank, Inter, Carteira"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="type"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Tipo
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="CHECKING">Conta corrente</option>
            <option value="SAVINGS">Poupança</option>
            <option value="CREDIT_CARD">Cartão de crédito</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="initialBalance"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Saldo inicial
          </label>
          <input
            id="initialBalance"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontWeight: 600, marginTop: "16px" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "#6366f1",
            color: "#ffffff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
            boxShadow: "0 8px 18px rgba(99,102,241,0.22)",
          }}
        >
          {loading ? "Salvando..." : "Criar conta"}
        </button>
      </div>
    </form>
  );
}