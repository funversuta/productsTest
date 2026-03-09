import { z } from 'zod'

export const addProductSchema = z.object({
  title: z.string().min(1, 'Наименование обязательно'),
  price: z
    .string()
    .min(1, 'Цена обязательна')
    .refine((v) => !Number.isNaN(parseFloat(v.replace(',', '.'))), 'Введите число')
    .refine((v) => parseFloat(v.replace(',', '.')) >= 0.01, 'Цена должна быть больше 0'),
  brand: z.string().min(1, 'Вендор обязателен'),
  sku: z.string().optional(),
})

export type AddProductFormData = z.infer<typeof addProductSchema>
