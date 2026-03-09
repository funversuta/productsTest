import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../../providers/StoresProvider'
import { Loader } from '../../../components/ui/Loader'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = observer(function AuthGuard({ children }: AuthGuardProps) {
  const { authStore } = useStores()

  if (authStore.isPending) {
    return <Loader />
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
})
