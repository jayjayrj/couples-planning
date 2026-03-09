"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

type Props = {
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

export default function NewIncomeForm({ onCreated, onCancel }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurrenceType, setRecurrenceType] = useState("ONCE");
  const [startDate, setStartDate] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await apiFetch("/incomes", {
        method: "POST",
        body: JSON.stringify({
          description,
          amount: Number(amount),
          recurrenceType,
          startDate,
          endDate: null,
          dayOfMonth: recurrenceType === "MONTHLY" ? Number(dayOfMonth) : null,
        }),
      });

      setDescription("");
      setAmount("");
      setStartDate("");
      setDayOfMonth("");
      setRecurrenceType("ONCE");

      onCreated();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar receita");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
          Nova receita
        </h3>

        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Cadastre uma nova receita para o household ativo.
        </p>
      </div>

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
            placeholder="Ex.: Salário, Freelance, Aluguel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Valor</label>
          <input
            style={inputStyle}
            placeholder="Ex.: 8000.00"
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
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Salvando..." : "Criar receita"}
        </button>
      </div>
    </form>
  );
}