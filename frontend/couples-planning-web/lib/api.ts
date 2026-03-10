export const API_BASE_URL = "http://localhost:8080";

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("accessToken");
  const householdId = localStorage.getItem("householdId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(householdId ? { "X-Household-Id": householdId } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAccounts() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/accounts", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar contas");
  }

  return response.json();
}

export type Account = {
  id: number;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH";
  currentBalance: number;
};