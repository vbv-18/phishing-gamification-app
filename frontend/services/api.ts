import { Module, TheoryData } from "@/types/module";
import { apiClient } from "./client";
import { CompleteLevelResponse, CompleteTheoryResponse, Level, LevelSummary } from "@/types/level";
import { LoginResponse, RegisterResponse, UserXpData } from "@/types/user";

export interface UserAnswer{ //define types of answers admitted
  question_id: number;
  answer: boolean | string | string[] | Record<string, string>;
}
export type AnswerValue = UserAnswer['answer'];

//auth endpoints
export async function loginUser(data: { username: string; password: string }): Promise<LoginResponse>{
  const body = new URLSearchParams(data).toString();
  const res = await apiClient.post("/auth/signIn", body, {headers: {"Content-Type": "application/x-www-form-urlencoded"},});

  return res.data;
}

export async function registerUser(data: {username: string; email: string; password: string;}): Promise<RegisterResponse>{
  const res = await apiClient.post("/auth/signUp", data, {headers: { "Content-Type": "application/json"},});
  return res.data;
}

//users endpoints
export async function getProfile(): Promise<{id: number; username: string; email: string}>{
  const res = await apiClient.get("/users/me");
  return res.data;
}

export async function deleteAccount(password: string): Promise<void>{
  const res = await apiClient.delete("/users/me", {data: {password}, headers: {"Content-Type": "application/json"},});
  return res.data;
}

export async function getUserXp(): Promise<UserXpData>{
  const res = await apiClient.get("/users/me/xp");
  return res.data;
}

//levels endpoints
export async function getModules(): Promise<Module[]>{
  const res = await apiClient.get(`/modules`);
  return res.data; 
}

export async function getModuleTheory(moduleId: number): Promise<TheoryData>{
  const res = await apiClient.get(`/modules/${moduleId}/theory`);
  return res.data; //{module_id, titile, theory: TheorySection[]}
}

export async function completeTheory(moduleId: number): Promise<CompleteTheoryResponse>{
  const res = await apiClient.post(`/modules/${moduleId}/theory/complete`);
  return res.data;
}

export async function getLevelsbyModule(moduleId: number): Promise<{theory_seen: boolean; levels: LevelSummary[]}>{
  const res = await apiClient.get(`/modules/${moduleId}/levels`);
  return res.data;
}

export async function getLevel(moduleId:number, levelId: number): Promise<Level>{
  const res = await apiClient.get(`/modules/${moduleId}/levels/${levelId}`);
  return res.data;
}

export async function checkAnswer(moduleId:number, levelId: number, question_id: number, answer: AnswerValue): Promise<{correct: boolean; feedback: string}>{
  const res = await apiClient.post(`/modules/${moduleId}/levels/${levelId}/check-answer`, {question_id, answer});
  return res.data; //{correct: boolean, feedback: string}
}

export async function completeLevel(moduleId:number, levelId:number, answers: UserAnswer[]): Promise<CompleteLevelResponse>{
  const res = await apiClient.post(`/modules/${moduleId}/levels/${levelId}/complete`, {answers});
  return res.data;
}