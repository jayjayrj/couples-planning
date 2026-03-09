"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contas", href: "/contas" },
  { label: "Receitas", href: "/receitas" },
  { label: "Despesas", href: "/despesas" },
  { label: "Metas", href: "/metas" },
  { label: "Projeção", href: "/projecao" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "24px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ margin: "0 0 32px 0" }}>Couples Planning</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "#ffffff",
                padding: "12px 14px",
                borderRadius: "10px",
                background: active ? "#1e293b" : "transparent",
                fontWeight: active ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}