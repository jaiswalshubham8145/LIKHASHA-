import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  },
);

export interface GenerateParams {
  input: string;
  category?: string;
  language?: string;
  mood?: string;
  accent?: string;
}

export interface GenerateResult {
  generationId: string;
  content: string;
  type: string;
  language: string;
  mood: string;
  accent?: string;
  scene: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  plan: "free" | "premium";
  dailyCount: number;
  dailyLimit: number;
  premiumExpiry: string | null;
  totalGenerations: number;
}

export interface GenerationDoc {
  id: string;
  uid: string;
  content: string;
  type: string;
  language: string;
  mood: string;
  scene: string;
  userInput: string;
  wordCount: number;
  shared: boolean;
  shareCount: number;
  createdAt: string;
}

export interface LibraryResult {
  generations: GenerationDoc[];
  nextCursor: string | null;
  total: number;
}

export async function generateContent(
  params: GenerateParams,
): Promise<GenerateResult> {
  const { data } = await api.post("/api/generate", params);
  return data.data;
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const { data } = await api.get(`/api/user/${uid}`);
  return data.data;
}

export async function getLibrary(params?: {
  type?: string;
  language?: string;
  limit?: number;
  cursor?: string;
}): Promise<LibraryResult> {
  const { data } = await api.get("/api/library", { params });
  return data.data;
}

export async function deleteGeneration(id: string): Promise<void> {
  await api.delete(`/api/library/${id}`);
}

export interface SaveGenerationParams {
  content: string;
  type: string;
  language: string;
  mood?: string;
  userInput?: string;
}

export async function saveGeneration(
  params: SaveGenerationParams,
): Promise<{ generationId: string }> {
  const { data } = await api.post("/api/library/save", params);
  return data.data;
}

export async function createSubscription(): Promise<{
  subscriptionId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}> {
  const { data } = await api.post("/api/subscribe");
  return data.data;
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
  rtl: boolean;
  group: "indian" | "international";
}

export interface ContentTypeInfo {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface MoodInfo {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export interface LanguagesResponse {
  languages: LanguageInfo[];
  contentTypes: ContentTypeInfo[];
  moods: MoodInfo[];
}

export async function getLanguages(): Promise<LanguagesResponse> {
  const { data } = await api.get("/api/languages");
  return data.data;
}
