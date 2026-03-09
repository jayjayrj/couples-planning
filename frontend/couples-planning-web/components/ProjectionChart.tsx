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

type ProjectionItem = {
  month: string;
  balance: number;
};

type Props = {
  data: ProjectionItem[];
};

function formatMonthLabel(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("pt-BR", {
    month: "short",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProjectionChart({ data }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: formatMonthLabel(item.month),
  }));

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
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="monthLabel" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
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