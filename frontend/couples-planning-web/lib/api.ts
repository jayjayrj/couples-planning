export const API_BASE_URL =
         process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.0.109:8080";

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("accessToken");
  const householdId = localStorage.getItem("householdId");

  const isFormData = options?.body instanceof FormData;

  const headers: HeadersInit = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(householdId && { "X-Household-Id": householdId }),
    ...(options?.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("householdId");
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API: ${response.status}${errorText ? ` - ${errorText}` : ""}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAccounts() {
  return apiFetch("/accounts");
}

export async function getHouseholds() {
  return apiFetch("/households");
}

export async function getActiveHousehold() {
  const householdId = localStorage.getItem("householdId");
  if (!householdId) return null;

  const households = await getHouseholds();
  return households.find(
    (household: { id: number; name: string }) =>
      household.id === Number(householdId)
  ) ?? null;
}