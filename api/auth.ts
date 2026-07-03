import { api } from "../axios/instance";
import * as SecureStore from "expo-secure-store";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * Persist tokens to Expo's SecureStore
 */
export async function saveAuthTokens(token: string, refreshToken?: string) {
  await SecureStore.setItemAsync("userToken", token);
  if (refreshToken) {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  }
}

/**
 * Remove tokens from Expo's SecureStore
 */
export async function clearAuthTokens() {
  await SecureStore.deleteItemAsync("userToken");
  await SecureStore.deleteItemAsync("refreshToken");
}

/**
 * Log in an existing user
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  const { token, refreshToken } = response.data;
  await saveAuthTokens(token, refreshToken);
  return response.data;
}

/**
 * Register/Sign up a new user
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  const { token, refreshToken } = response.data;
  await saveAuthTokens(token, refreshToken);
  return response.data;
}

/**
 * Fetch current user profile details
 */
export async function getProfile(): Promise<User> {
  const response = await api.get<User>("/auth/profile");
  return response.data;
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.warn("Logout request failed, cleaning local session anyway:", error);
  } finally {
    await clearAuthTokens();
  }
}
