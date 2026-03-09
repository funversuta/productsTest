export interface LoginCredentials {
  username: string
  password: string
  remember: boolean
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}
