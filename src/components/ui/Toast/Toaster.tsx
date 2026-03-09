import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: 'var(--radiusLg)',
          padding: '12px 16px',
          fontSize: '14px',
        },
      }}
    />
  )
}
