export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Couples Planning</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <a>Dashboard</a>
        <a>Contas</a>
        <a>Receitas</a>
        <a>Despesas</a>
        <a>Metas</a>
        <a>Projeção</a>
      </nav>
    </aside>
  );
}