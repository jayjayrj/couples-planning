// app/login/page.tsx
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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("householdId");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();

      if (!data?.accessToken) {
        throw new Error("Token de acesso não retornado");
      }

      localStorage.setItem("accessToken", data.accessToken);

      const householdsResponse = await fetch(`${API_BASE_URL}/households`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!householdsResponse.ok) {
        throw new Error("Erro ao carregar households");
      }

      const households = await householdsResponse.json();

      if (!Array.isArray(households) || households.length === 0) {
        throw new Error("Usuário não possui household");
      }

      localStorage.setItem("householdId", String(households[0].id));
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3f5fb] p-4">
      <div className="mx-auto h-full max-w-[1400px]">
        <div className="grid h-full grid-rows-[78px_minmax(0,1fr)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <header className="flex items-center justify-end border-b border-slate-200 px-8">
            <img src="/logo-top-right.png" alt="HomeLedger" />
          </header>

          <div className="grid min-h-0 grid-cols-1 md:grid-cols-[0.95fr_1.05fr]">
            <section className="min-h-0 overflow-y-auto bg-white">
              <div className="mx-auto flex min-h-full w-full max-w-[620px] flex-col justify-start px-12 pt-14 pb-10 md:px-16 md:pt-16 md:pb-12">
                <h1 className="mb-10 max-w-[470px] text-[26px] font-semibold leading-[1.28] tracking-[-0.01em] text-slate-700 md:text-[20px]">
                  Organize as finanças do seu lar em um só lugar.
                </h1>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-3 block text-[15px] font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="h-[58px] w-full rounded-[14px] border border-slate-200 bg-[#eef3ff] px-4 text-[16px] text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-3 block text-[15px] font-medium text-slate-700"
                    >
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-[58px] w-full rounded-[14px] border border-slate-200 bg-[#eef3ff] px-4 text-[16px] text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[58px] w-full items-center justify-center rounded-[14px] bg-gradient-to-r from-indigo-500 to-violet-600 text-[18px] font-semibold text-white transition hover:from-indigo-600 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[16px] text-slate-500">ou</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="flex h-[58px] w-full items-center justify-center rounded-[14px] border border-slate-300 bg-white text-[18px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Criar conta
                </button>
              </div>
            </section>

            <section className="relative hidden min-h-0 md:block">
              <div className="absolute inset-0 bg-[#eef3ff]" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/login-illustration.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center right",
                  backgroundSize: "cover",
                }}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}