import { apiClient } from "./client";

//auth endpoints
export async function loginUser(data: { username: string; password: string }){
  const body = new URLSearchParams(data).toString();
  const res = await apiClient.post("/auth/signIn", body, {headers: {"Content-Type": "application/x-www-form-urlencoded"},});

  return res.data;
}

export async function registerUser(data: {username: string; email: string; password: string;}) {
  const res = await apiClient.post("/auth/signUp", data, {headers: { "Content-Type": "application/json"},});
  return res.data;
}

//users endpoints
export async function getProfile(){
  const res = await apiClient.get("/users/me");
  return res.data;
}

export async function deleteAccount(password: string){
  const res = await apiClient.delete("/users/me", {data: {password}, headers: {"Content-Type": "application/json"},});
  return res.data;
}

//levels endpoints
export async function getNextLevel(moduleName: string){
  const res = await apiClient.get(`/levels/module/${moduleName}/next`);
  return res.data;
}

export async function getLevel(id: number){
  const res = await apiClient.get(`/levels/${id}`);
  return res.data;
}

export async function getLevelsbyModule(moduleName: string){
  const res = await apiClient.get(`/levels/module/${moduleName}`);
  return res.data;
}

export async function completeLevel(id:number, correctAnswers: number){
  const res = await apiClient.post(`/levels/${id}/complete`, {correct_answers: correctAnswers});
  return res.data;
}

export async function getUserXp(){
  const res = await apiClient.get("/users/me/xp");
  return res.data;
}