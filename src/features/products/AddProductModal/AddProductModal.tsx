import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { showToast } from '../../../components/ui/Toast'
import { productsApi } from '../../../api/products.api'
import { addProductSchema, type AddProductFormData } from './validation'
import styles from './AddProductModal.module.css'

export interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: { title: '', price: '', brand: '', sku: '' },
  })

  const onSubmit = async (data: AddProductFormData) => {
    const price = parseFloat(data.price.replace(',', '.'))
    try {
      await productsApi.addProduct({
        title: data.title,
        price,
        brand: data.brand,
        sku: data.sku || undefined,
      })
      showToast('Товар добавлен', 'success')
      reset()
      onSuccess?.()
      onClose()
    } catch (e) {
      showToast((e as Error).message, 'error')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить товар">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              label="Наименование"
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите наименование"
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Input
              label="Цена"
              type="text"
              value={field.value}
              onChange={field.onChange}
              placeholder="0.00"
              error={errors.price?.message}
            />
          )}
        />

        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <Input
              label="Вендор"
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите вендора"
              error={errors.brand?.message}
            />
          )}
        />

        <Controller
          name="sku"
          control={control}
          render={({ field }) => (
            <Input
              label="Артикул"
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Введите артикул"
              error={errors.sku?.message}
            />
          )}
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Добавить
          </Button>
        </div>
      </form>
    </Modal>
  )
}
