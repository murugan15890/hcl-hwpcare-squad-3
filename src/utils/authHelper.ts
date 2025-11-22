// src/utils/authHelpers.ts (optional)
export function saveAuthToStorage(token: string, user: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
