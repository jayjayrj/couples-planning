"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function MetasPage() {
  return (
    <AuthGuard>
      <main className="page-container">
        <h1>Metas</h1>
        <p>Página em construção.</p>
      </main>
    </AuthGuard>
  );
}