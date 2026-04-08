import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export async function saveToken(accessToken: string, refreshToken: string) { //sign in
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getToken() { //for authenticated requests
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRefreshToken() { //for authenticated requests
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function removeToken() { //for sign out
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}