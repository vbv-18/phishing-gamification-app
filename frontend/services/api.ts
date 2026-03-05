import { getToken } from './auth';

const BASE_URL = 'http://10.0.2.2:8000';
//10.0.2.2
async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
){
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

  if(res.status == 204){ //delete current user does not return anything
    return null;
  }

  return res.json();
}

//auth endpoints
export async function loginUser(data: { username: string; password: string }){
  const body = new URLSearchParams({
    username: data.username,
    password: data.password,
  }).toString();

  return apiFetch('/auth/signIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', }, body,
  });
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch('/auth/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(data),
  });
}

//users endpoints
export async function getProfile(){
  return apiFetch('/users/me');
}

export async function deleteAccount(password: string){
  return apiFetch('/users/me', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password}),});
}

//levels endpoints
export async function getNextLevel(moduleName: string){
  return apiFetch(`/levels/module/${moduleName}/next`);
}

export async function getLevel(id: number){
  return apiFetch(`/levels/${id}`);
}

export async function getLevelsbyModule(moduleName: string){
  return apiFetch(`/levels/module/${moduleName}`);
}

export async function completeLevel(id:number){
  return apiFetch(`/levels/${id}/complete`, {method: 'POST',});
}
