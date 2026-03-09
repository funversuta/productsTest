import { storageService } from '../services/storage.service'

export interface ApiClientOptions {
  onUnauthorized?: () => void
}

let onUnauthorizedCallback: (() => void) | undefined

export function setApiClientOnUnauthorized(fn: () => void) {
  onUnauthorizedCallback = fn
}

export async function apiClient<T>(
  url: string,
  options: RequestInit & { clientOptions?: ApiClientOptions } = {}
): Promise<T> {
  const { clientOptions, ...fetchOptions } = options as RequestInit & { clientOptions?: ApiClientOptions }
  const onUnauthorized = clientOptions?.onUnauthorized ?? onUnauthorizedCallback

  const token = storageService.getAccessToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers ?? {}),
  }
  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...fetchOptions, headers })

  if (res.status === 401) {
    onUnauthorized?.()
    throw new Error('Сессия истекла')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { message?: string }).message ?? 'Ошибка запроса')
  return data
}
