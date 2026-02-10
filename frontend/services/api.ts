import { getToken } from './auth';

const BASE_URL = 'http://10.0.2.2:8000';

async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await getToken();

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
  const data = await res.json().catch(() => null);

  let message = 'Error inesperado';

  if (data?.detail) {
    if (typeof data.detail === 'string') {
      message = data.detail;
    }
    else if (Array.isArray(data.detail)) {
      message = data.detail
        .map((err: any) => `${err.loc.slice(1).join('.')}: ${err.msg}`)
        .join('\n');
    }
  } else if (res.status === 400) message = 'Datos incorrectos';
  else if (res.status === 401) message = 'Credenciales inválidas';
  else if (res.status === 403) message = 'Acceso no autorizado';
  else if (res.status >= 500) message = 'Error del servidor';

  throw new Error(message);
}

  return res.json();
}

// ---------- AUTH ----------

export async function loginUser(data: { username: string; password: string }) {
  const body = new URLSearchParams({
    username: data.username,
    password: data.password,
  }).toString();

  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', }, body,
  });
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(data),
  });
}

// ---------- USER ----------

export async function getProfile() {
  return apiFetch('/users/me');
}
