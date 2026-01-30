import { getAccessToken } from "./tokenStorage";
import { refreshSession } from "./refreshSession";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any; // JSON | FormData
  headers?: Record<string, string>;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
  onLogout?: () => Promise<void>
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  let accessToken = await getAccessToken();

  const isFormData = body instanceof FormData;

  const makeRequest = async () => {
    const finalHeaders: Record<string, string> = {
      ...headers,
    };

    // only set JSON header if NOT FormData
    if (!isFormData) {
      finalHeaders["Content-Type"] = "application/json";
    }

    if (accessToken) {
      finalHeaders.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: finalHeaders,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });
  };


  let response = await makeRequest();

// refresh on expiry 
  if (response.status === 401) {
    const refreshed = await refreshSession();

    if (!refreshed) {
      if (onLogout) await onLogout();
      throw new Error("SESSION_EXPIRED");
    }

    accessToken = await getAccessToken();
    response = await makeRequest();
  }

// miscellaneous errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Request failed");
  }

  return response.json();
}
