"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.accessToken);

      // por enquanto vamos fixar household 1
      localStorage.setItem("householdId", "1");

      router.push("/");

    } catch (err) {

      setError("Email ou senha inválidos");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          width: "360px",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >

        <h1 style={{marginTop:0}}>Couples Planning</h1>

        <p style={{color:"#6b7280"}}>
          Faça login para continuar
        </p>

        {error && (
          <p style={{color:"#dc2626"}}>
            {error}
          </p>
        )}

        <div style={{marginTop:"20px"}}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            style={{
              width:"100%",
              padding:"10px",
              marginTop:"6px",
              border:"1px solid #e5e7eb",
              borderRadius:"8px"
            }}
          />
        </div>

        <div style={{marginTop:"16px"}}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            style={{
              width:"100%",
              padding:"10px",
              marginTop:"6px",
              border:"1px solid #e5e7eb",
              borderRadius:"8px"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop:"24px",
            width:"100%",
            padding:"12px",
            background:"#6366f1",
            color:"white",
            border:"none",
            borderRadius:"8px",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </form>

    </div>
  );
}