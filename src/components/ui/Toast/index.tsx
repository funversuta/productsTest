import toast from 'react-hot-toast'

export type ToastType = 'success' | 'error'

export function showToast(message: string, type: ToastType = 'success'): void {
  if (type === 'success') {
    toast.success(message)
  } else {
    toast.error(message)
  }
}
