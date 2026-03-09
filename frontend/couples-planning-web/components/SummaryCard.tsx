type Props = {
  title: string
  value: string
  color: string
}

export default function SummaryCard({ title, value, color }: Props) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "8px 0 0 0",
          fontSize: "24px",
          color: "#111827",
        }}
      >
        {value}
      </h2>
    </div>
  )
}