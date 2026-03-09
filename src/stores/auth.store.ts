import { makeAutoObservable, runInAction } from 'mobx'
import { authApi } from '../api/auth.api'
import { storageService, ACCESS_TOKEN_KEY } from '../services/storage.service'
import type { User } from '../types/auth'

export type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated'

export function createAuthStore() {
  class AuthStore {
    user: User | null = null
    error: string | null = null
    authStatus: AuthStatus = 'pending'

    constructor() {
      makeAutoObservable(this)
    }

    get isAuthenticated(): boolean {
      return this.authStatus === 'authenticated'
    }

    get isPending(): boolean {
      return this.authStatus === 'pending'
    }

    login = async (username: string, password: string, remember: boolean) => {
      this.error = null
      try {
        const res = await authApi.login(username, password)
        storageService.setTokens(res.accessToken, res.refreshToken, remember)
        runInAction(() => {
          this.user = {
            id: res.id,
            username: res.username,
            email: res.email,
            firstName: res.firstName,
            lastName: res.lastName,
            gender: res.gender,
            image: res.image,
          }
          this.authStatus = 'authenticated'
        })
      } catch (e) {
        runInAction(() => {
          this.error = (e as Error).message
          this.authStatus = 'unauthenticated'
        })
      }
    }

    logout = () => {
      storageService.clearTokens()
      this.user = null
      this.error = null
      this.authStatus = 'unauthenticated'
    }

    initAuth = async () => {
      const accessToken = storageService.getAccessToken()
      const refreshToken = storageService.getRefreshToken()

      if (!accessToken) {
        runInAction(() => {
          this.authStatus = 'unauthenticated'
        })
        return
      }

      try {
        const user = await authApi.getMe(accessToken)
        runInAction(() => {
          this.user = user
          this.authStatus = 'authenticated'
        })
      } catch {
        if (refreshToken) {
          try {
            const res = await authApi.refresh(refreshToken)
            const remember = !!localStorage.getItem(ACCESS_TOKEN_KEY)
            storageService.setTokens(res.accessToken, res.refreshToken, remember)
            const user = await authApi.getMe(res.accessToken)
            runInAction(() => {
              this.user = user
              this.authStatus = 'authenticated'
            })
          } catch {
            this.logout()
          }
        } else {
          this.logout()
        }
      }
    }
  }
  return new AuthStore()
}
