"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getActiveHousehold, apiFetch } from "@/lib/api";

type Household = {
  id: number;
  name: string;
};

type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [household, setHousehold] = useState<Household | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadLayoutData() {
      try {
        const [householdData, userData] = await Promise.all([
          getActiveHousehold(),
          apiFetch("/auth/me"),
        ]);

        setHousehold(householdData);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar dados do layout", error);
      }
    }

    loadLayoutData();
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
          userName={user?.fullName}
          avatarUrl={user?.avatarUrl}
        />
        {children}
      </div>
    </div>
  );
}