export const ACCESS_TOKEN_KEY = 'auth_access_token'
export const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export const storageService = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setTokens(accessToken: string, refreshToken: string, remember: boolean): void {
    this.clearTokens()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(ACCESS_TOKEN_KEY, accessToken)
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
