"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterPage() {

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {

    if (!fullName.trim()) {
      setError("Informe seu nome");
      return;
    }

    if (!email.trim()) {
      setError("Informe seu email");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          householdName
        })
      });

      if (!response.ok) {

        const body = await response.text();

        console.error("Register status:", response.status);
        console.error("Register body:", body);

        setError(body);

        throw new Error(body);
      }

      // login automático após cadastro
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const loginData = await loginResponse.json();

      localStorage.setItem("accessToken", loginData.accessToken);

      const householdsResponse = await fetch(`${API_BASE_URL}/households`, {
        headers:{
          Authorization:`Bearer ${loginData.accessToken}`
        }
      });

      const households = await householdsResponse.json();

      localStorage.setItem("householdId", households[0].id.toString());

      // upload do avatar se existir
      if (avatar) {
        const formData = new FormData();
        formData.append("file", avatar);

        const avatarResponse = await fetch(`${API_BASE_URL}/users/me/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${loginData.accessToken}`,
          },
          body: formData,
        });

        if (!avatarResponse.ok) {
          const avatarError = await avatarResponse.text();
          console.error("Avatar upload error:", avatarResponse.status, avatarError);
          throw new Error("Falha ao enviar avatar");
        }

        const avatarData = await avatarResponse.json();
        console.log("Avatar upload success:", avatarData);
      }

      router.push("/dashboard");

    } catch(err){

      setError("Não foi possível criar a conta");

    } finally{

      setLoading(false);

    }

  }

  return (
    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"#f8fafc"
      }}
    >

      <form
        onSubmit={handleRegister}
        style={{
          width:"360px",
          background:"white",
          padding:"40px",
          borderRadius:"16px",
          boxShadow:"0 8px 24px rgba(0,0,0,0.08)"
        }}
      >

        <h1 style={{marginTop:0}}>Criar conta</h1>

        {error && (
          <p style={{color:"#dc2626"}}>
            {error}
          </p>
        )}

        <div style={{marginTop:"16px"}}>
          <label>Nome completo</label>
          <input
            value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
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
          <label>Nome da família</label>
          <input
            value={householdName}
            onChange={(e)=>setHouseholdName(e.target.value)}
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

        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>Foto (opcional)</label>

          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setAvatar(file);
              setAvatarPreview(file ? URL.createObjectURL(file) : null);
            }}
            style={{ display: "none" }}
          />

          <label
            htmlFor="avatar"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Escolher foto
          </label>

          <div style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
            {avatarPreview && (
              <div style={{ marginTop: "12px" }}>
                <img
                  src={avatarPreview}
                  alt="Preview do avatar"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "999px",
                    objectFit: "cover",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>
            )}
          </div>
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
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={()=>router.push("/login")}
          style={{
            marginTop:"10px",
            width:"100%",
            padding:"10px",
            border:"1px solid #e5e7eb",
            borderRadius:"8px",
            background:"white",
            cursor:"pointer"
          }}
        >
          Voltar para login
        </button>

      </form>

    </div>
  );
}