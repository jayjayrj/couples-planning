export default function Topbar() {
  return (
    <header
      style={{
        height: "72px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
          Household ativo
        </p>
        <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>
          Casa Jay e Parceira
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "999px",
            background: "#ede9fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5b21b6",
            fontWeight: "bold",
          }}
        >
          J
        </div>

        <div>
          <p style={{ margin: 0, fontWeight: 600, color: "#111827" }}>
            Jay Junior
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Usuário logado
          </p>
        </div>
      </div>
    </header>
  );
}