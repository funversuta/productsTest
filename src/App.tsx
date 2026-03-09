import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/Toast/Toaster'
import { StoresProvider } from './providers/StoresProvider'
import { ApiClientSetup } from './providers/ApiClientSetup'
import { AuthGuard } from './features/auth/AuthGuard/AuthGuard'
import { RootRedirect } from './pages/RootRedirect/RootRedirect'
import { LoginPage } from './pages/Login/LoginPage'
import { ProductsPage } from './pages/Products/ProductsPage'

function App() {
  return (
    <StoresProvider>
      <BrowserRouter>
        <ApiClientSetup>
          <Toaster />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<AuthGuard><ProductsPage /></AuthGuard>} />
          </Routes>
        </ApiClientSetup>
      </BrowserRouter>
    </StoresProvider>
  )
}

export default App
