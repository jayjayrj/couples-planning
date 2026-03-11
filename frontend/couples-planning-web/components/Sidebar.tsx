"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, TrendingUp, Receipt, Target, LineChart, Heart, FileUp } from "lucide-react";
import { useEffect } from "react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contas", href: "/contas", icon: Wallet },
  { label: "Receitas", href: "/receitas", icon: TrendingUp },
  { label: "Despesas", href: "/despesas", icon: Receipt },
  { label: "Metas", href: "/metas", icon: Target },
  { label: "Projeção", href: "/projecao", icon: LineChart },
  { label: "Importação", href: "/importacao", icon: FileUp },
];

type Props = {
  mode?: "desktop" | "mobile";
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  mode = "desktop",
  mobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();
  const isMobile = mode === "mobile";

  useEffect(() => {
    if (isMobile && mobileOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.08)",
            zIndex: 30,
          }}
        />
      )}

      <aside
        style={{
          width: "248px",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          color: "#0f172a",
          padding: "20px 14px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          borderRight: "1px solid #e5e7eb",
          boxShadow: isMobile ? "8px 0 24px rgba(15,23,42,0.12)" : "none",
          zIndex: 40,
          ...(isMobile
            ? {
                position: "fixed" as const,
                top: 0,
                left: mobileOpen ? 0 : "-260px",
                transition: "left 0.25s ease",
              }
            : {
                position: "sticky" as const,
                top: 0,
              }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #93c5fd, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Heart size={20} />
          </div>
          <div style={{ fontWeight: 700, fontSize: "24px", color: "#1f2937" }}>
            Couples Planning
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textDecoration: "none",
                  color: active ? "#ffffff" : "#475569",
                  padding: "14px 14px",
                  borderRadius: "14px",
                  background: active ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "transparent",
                  fontWeight: active ? 700 : 600,
                  boxShadow: active ? "0 8px 18px rgba(37,99,235,0.22)" : "none",
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}