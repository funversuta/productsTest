import type { Product, ProductsParams, ProductsResponse } from '../types/product'

const PRODUCTS_BASE = 'https://dummyjson.com/products'

export const productsApi = {
  async getProducts(params: ProductsParams): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()
    searchParams.set('limit', String(params.limit))
    searchParams.set('skip', String(params.skip))
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.order) searchParams.set('order', params.order)

    const query = searchParams.toString()
    const url = params.search
      ? `${PRODUCTS_BASE}/search?q=${encodeURIComponent(params.search)}&${query}`
      : `${PRODUCTS_BASE}?${query}`

    const res = await fetch(url)

    if (!res.ok) throw new Error('Ошибка загрузки товаров')
    return res.json() as Promise<ProductsResponse>
  },

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${PRODUCTS_BASE}/${id}`)
    if (!res.ok) throw new Error('Товар не найден')
    return res.json() as Promise<Product>
  },

  async addProduct(data: { title: string; price?: number; brand?: string; sku?: string }): Promise<Product> {
    const res = await fetch(`${PRODUCTS_BASE}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Ошибка добавления товара')
    return res.json() as Promise<Product>
  },
}
