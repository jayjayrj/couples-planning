type Props = {
  title: string;
  value: string;
  color: string;
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function SummaryCard({ title, value, color }: Props) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(color, 0.92)} 0%, ${color} 60%, ${hexToRgba(color, 0.75)} 100%)`,
        borderRadius: "14px",
        padding: "14px 18px",
        minHeight: "92px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 20px ${hexToRgba(color, 0.20)}`,
        border: `1px solid ${hexToRgba(color, 0.22)}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.90)",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "8px 0 0 0",
          fontSize: "16px",
          lineHeight: 1.2,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {value}
      </h2>
    </div>
  );
}