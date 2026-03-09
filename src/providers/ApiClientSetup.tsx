import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setApiClientOnUnauthorized } from '../api/client'
import { useStores } from './StoresProvider'

export function ApiClientSetup({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { authStore } = useStores()

  useEffect(() => {
    setApiClientOnUnauthorized(() => {
      authStore.logout()
      navigate('/login', { replace: true })
    })
  }, [navigate, authStore])

  return <>{children}</>
}
