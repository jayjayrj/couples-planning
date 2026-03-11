"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getActiveHousehold } from "@/lib/api";

type Household = {
  id: number;
  name: string;
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [household, setHousehold] = useState<Household | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadActiveHousehold() {
      try {
        const data = await getActiveHousehold();
        setHousehold(data);
      } catch (error) {
        console.error("Erro ao carregar household ativo", error);
      }
    }

    loadActiveHousehold();
  }, []);

  return (
    <div className="app-shell">
      <div className="desktop-sidebar">
        <Sidebar mode="desktop" />
      </div>

      <div className="mobile-sidebar">
        <Sidebar
          mode="mobile"
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="app-content">
        <Topbar
          onMenuClick={() => setMobileMenuOpen((prev) => !prev)}
          householdName={household?.name}
        />
        {children}
      </div>
    </div>
  );
}