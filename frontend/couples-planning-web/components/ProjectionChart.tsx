"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Abr", balance: 5500 },
  { month: "Mai", balance: 7000 },
  { month: "Jun", balance: 8200 },
  { month: "Jul", balance: 9100 },
  { month: "Ago", balance: 10200 },
  { month: "Set", balance: 11800 },
];

export default function ProjectionChart() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginTop: "32px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
          Projeção Financeira
        </p>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "22px", color: "#111827" }}>
          Evolução do saldo
        </h2>
      </div>

      <div style={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}