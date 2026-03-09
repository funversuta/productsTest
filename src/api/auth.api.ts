import type { AuthResponse, RefreshResponse, User } from '../types/auth'

const AUTH_BASE = 'https://dummyjson.com/auth'

export const authApi = {
  async login(username: string, password: string, expiresInMins = 30): Promise<AuthResponse> {
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins }),
      credentials: 'include',
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error((data as { message?: string }).message ?? 'Ошибка авторизации')
    }

    return data as AuthResponse
  },

  async refresh(refreshToken: string, expiresInMins = 30): Promise<RefreshResponse> {
    const res = await fetch(`${AUTH_BASE}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken, expiresInMins }),
      credentials: 'include',
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error((data as { message?: string }).message ?? 'Ошибка обновления токена')
    }

    return data as RefreshResponse
  },

  async getMe(accessToken: string): Promise<User> {
    const res = await fetch(`${AUTH_BASE}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error((data as { message?: string }).message ?? 'Токен недействителен')
    }

    return data as User
  },
}
