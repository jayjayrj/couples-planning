"use client";

import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

type Props = {
  onMenuClick?: () => void;
  householdName?: string;
  userName?: string;
  avatarUrl?: string | null;
};

export default function Topbar({
  onMenuClick,
  householdName,
  userName,
  avatarUrl,
}: Props) {
    console.log("avatarUrl:", avatarUrl);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("householdId");
    router.push("/login");
  }

  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <header
      style={{
        height: "88px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onMenuClick}
          className="mobile-menu-button"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ☰
        </button>

        <div>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            Household ativo
          </p>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#111827" }}>
            {householdName ?? "Household"}
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Sair
        </button>

        {avatarUrl ? (
          <img
            src={`${API_BASE_URL}${avatarUrl}`}
            alt={userName ?? "Usuário"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "999px",
              objectFit: "cover",
            }}
          />
        ) : (
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
            {initial}
          </div>
        )}
      </div>
    </header>
  );
}