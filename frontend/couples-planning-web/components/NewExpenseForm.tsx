"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH";
  currentBalance: number;
};

type Props = {
  accounts: Account[];
  onCreated: () => void;
  onCancel: () => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  background: "#ffffff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#374151",
};

export default function NewExpenseForm({ accounts, onCreated, onCancel }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurrenceType, setRecurrenceType] = useState("ONCE");
  const [startDate, setStartDate] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [accountId, setAccountId] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accountId) {
      alert("Selecione uma conta");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          description,
          amount: Number(amount),
          recurrenceType,
          startDate,
          endDate: null,
          dayOfMonth: recurrenceType === "MONTHLY" ? Number(dayOfMonth) : null,
          accountId: Number(accountId),
        }),
      });

      setDescription("");
      setAmount("");
      setStartDate("");
      setDayOfMonth("");
      setRecurrenceType("ONCE");
      setAccountId("");

      onCreated();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar despesa");
    } finally {
      setLoading(false);
    }
  }

  const hasAccounts = accounts.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "24px",
        border: "1px solid #eef2f7",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Nova despesa
        </h3>

        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Cadastre uma nova despesa para o household ativo.
        </p>
      </div>

      {!hasAccounts && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fef3f2",
            border: "1px solid #fecdca",
            color: "#b42318",
            fontSize: "14px",
          }}
        >
          Você precisa cadastrar uma conta antes de criar uma despesa.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Descrição</label>
          <input
            style={inputStyle}
            placeholder="Ex.: Aluguel, Internet, Mercado"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Conta</label>
          <select
            style={inputStyle}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            <option value="">Selecione uma conta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Valor</label>
          <input
            style={inputStyle}
            placeholder="Ex.: 2500.00"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Recorrência</label>
          <select
            style={inputStyle}
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value)}
          >
            <option value="ONCE">Única</option>
            <option value="MONTHLY">Mensal</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Data inicial</label>
          <input
            style={inputStyle}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {recurrenceType === "MONTHLY" && (
          <div>
            <label style={labelStyle}>Dia do mês</label>
            <input
              style={inputStyle}
              type="number"
              min="1"
              max="31"
              placeholder="Ex.: 5"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              required
            />
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading || !hasAccounts}
          style={{
            padding: "12px 18px",
            background: loading || !hasAccounts ? "#a5b4fc" : "#6366f1",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            cursor: loading || !hasAccounts ? "not-allowed" : "pointer",
            fontWeight: 700,
            minWidth: "180px",
            boxShadow: "0 6px 18px rgba(99,102,241,0.25)",
          }}
        >
          {loading ? "Salvando..." : "Criar despesa"}
        </button>
      </div>
    </form>
  );
}