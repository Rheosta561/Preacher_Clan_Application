import { getRefreshToken, saveTokens } from "./tokenStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function refreshSession(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    await saveTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}
