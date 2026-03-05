import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';

export async function saveToken(token: string) { //sign in
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() { //for authenticated requests
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() { //for sign out
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function signOut() { //signOut (endpoint not necessary)
  await removeToken();
}