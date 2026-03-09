import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../providers/StoresProvider'
import { Loader } from '../../components/ui/Loader'

export const RootRedirect = observer(function RootRedirect() {
  const { authStore } = useStores()

  if (authStore.isPending) {
    return <Loader />
  }

  return (
    <Navigate to={authStore.isAuthenticated ? '/products' : '/login'} replace />
  )
})
