import { createContext, useContext, useEffect, useMemo } from 'react'
import { createAuthStore, createProductsStore } from '../stores'
import { showToast } from '../components/ui/Toast'

type Stores = ReturnType<typeof createStores>

function createStores() {
  return {
    authStore: createAuthStore(),
    productsStore: createProductsStore((msg) => showToast(msg, 'error')),
  }
}

const StoresContext = createContext<Stores | null>(null)

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const stores = useMemo(createStores, [])

  useEffect(() => {
    stores.authStore.initAuth()
  }, [stores.authStore])

  return (
    <StoresContext.Provider value={stores}>
      {children}
    </StoresContext.Provider>
  )
}

export function useStores() {
  const ctx = useContext(StoresContext)
  if (!ctx) throw new Error('useStores must be used within StoresProvider')
  return ctx
}
