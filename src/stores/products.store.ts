import { makeAutoObservable, runInAction } from 'mobx'
import { productsApi } from '../api/products.api'
import type { Product } from '../types/product'
import type { SortOrder, SortField } from '../types'

export function createProductsStore(onError?: (message: string) => void) {
  class ProductsStore {
    products: Product[] = []
    loading = false
    error: string | null = null
    total = 0
    page = 1
    limit = 30
    sortBy: SortField | null = null
    order: SortOrder = 'asc'
    search = ''

    constructor() {
      makeAutoObservable(this)
    }

    get skip(): number {
      return (this.page - 1) * this.limit
    }

    get totalPages(): number {
      return Math.ceil(this.total / this.limit) || 1
    }

    fetchProducts = async () => {
      this.loading = true
      this.error = null
      try {
        const res = await productsApi.getProducts({
          limit: this.limit,
          skip: this.skip,
          sortBy: this.sortBy ?? undefined,
          order: this.order,
          search: this.search || undefined,
        })
        runInAction(() => {
          this.products = res.products
          this.total = res.total
        })
      } catch (e) {
        const msg = (e as Error).message
        runInAction(() => {
          this.error = msg
          this.products = []
        })
        onError?.(msg)
      } finally {
        runInAction(() => {
          this.loading = false
        })
      }
    }

    setPage = (page: number) => {
      this.page = page
      this.fetchProducts()
    }

    setSort = (sortBy: SortField) => {
      const isSameColumn = this.sortBy === sortBy
      this.sortBy = sortBy
      this.order = isSameColumn ? (this.order === 'asc' ? 'desc' : 'asc') : 'asc'
      this.fetchProducts()
    }

    setSearch = (q: string) => {
      this.search = q
      this.page = 1
      this.fetchProducts()
    }

    applyFiltersFromUrl = (page: number, sortBy: SortField | null, order: SortOrder, search: string) => {
      if (
        this.page === page &&
        this.sortBy === sortBy &&
        this.order === order &&
        this.search === search
      ) {
        return
      }
      this.page = page
      this.sortBy = sortBy
      this.order = order
      this.search = search
      this.fetchProducts()
    }
  }
  return new ProductsStore()
}
