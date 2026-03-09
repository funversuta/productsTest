import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useSearchParams } from 'react-router-dom'
import type { UrlFilterUpdates, SortField } from '../../types'
import { parseSortField } from '../../types'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SearchInput } from '../../components/ui/SearchInput/SearchInput'
import { AddProductModal } from '../../features/products/AddProductModal/AddProductModal'
import { ProductsTable } from '../../features/products/ProductsTable/ProductsTable'
import { Pagination } from '../../features/products/Pagination/Pagination'
import { useStores } from '../../providers/StoresProvider'
import ArrowsClockwiseIcon from '../../assets/ArrowsClockwise.svg?react'
import styles from './ProductsPage.module.css'

export const ProductsPage = observer(function ProductsPage() {
  const { authStore, productsStore } = useStores()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const sortBy = parseSortField(searchParams.get('sortBy'))
    const order = (searchParams.get('order') ?? 'asc') as 'asc' | 'desc'
    const search = searchParams.get('q') ?? ''
    productsStore.applyFiltersFromUrl(page, sortBy, order, search)
  }, [searchParams])

  const updateUrl = (updates: UrlFilterUpdates) => {
    const next = new URLSearchParams(searchParams)
    if (updates.page !== undefined) next.set('page', String(updates.page))
    if (updates.sortBy !== undefined) {
      if (updates.sortBy) next.set('sortBy', updates.sortBy)
      else next.delete('sortBy')
    }
    if (updates.order !== undefined) next.set('order', updates.order)
    if (updates.q !== undefined) {
      if (updates.q) next.set('q', updates.q)
      else next.delete('q')
    }
    setSearchParams(next, { replace: true })
  }

  const handlePageChange = (page: number) => {
    productsStore.setPage(page)
    updateUrl({ page })
  }

  const handleSort = (field: SortField) => {
    productsStore.setSort(field)
    updateUrl({
      sortBy: productsStore.sortBy,
      order: productsStore.order,
    })
  }

  const handleSearchChange = (q: string) => {
    productsStore.setSearch(q)
    updateUrl({ q, page: 1 })
  }

  return (
    <div>
      <Header
        title="Товары"
        center={
          <SearchInput
            value={searchParams.get('q') ?? ''}
            onChange={handleSearchChange}
            placeholder="Найти"
            debounceMs={300}
          />
        }
      >
        <Button variant="secondary" onClick={() => authStore.logout()}>
          Выход
        </Button>
      </Header>
      <main className={styles.main}>
        <div className={styles.toolbar}>
          <h2 className={styles.sectionTitle}>Все позиции</h2>
          <div className={styles.toolbarActions}>
            <button
              type="button"
              className={styles.refreshButton}
              onClick={() => productsStore.fetchProducts()}
              disabled={productsStore.loading}
              aria-label="Обновить"
            >
              <ArrowsClockwiseIcon />
            </button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              Добавить
            </Button>
          </div>
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => productsStore.fetchProducts()}
        />

        {productsStore.error && (
          <div className={styles.error} role="alert">
            {productsStore.error}
          </div>
        )}

        {productsStore.loading && <ProgressBar />}

        {!productsStore.loading && productsStore.products.length === 0 && !productsStore.error && (
          <p className={styles.empty}>Товары не найдены</p>
        )}

        <ProductsTable
          products={productsStore.products}
          sortBy={productsStore.sortBy}
          order={productsStore.order}
          onSort={handleSort}
        />

        <div className={styles.footer}>
          <p className={styles.count}>
            <span className={styles.countLabel}>Показано </span>
            {(productsStore.page - 1) * productsStore.limit + 1}–
            {Math.min(productsStore.page * productsStore.limit, productsStore.total)}
            <span className={styles.countLabel}> из </span>
            {productsStore.total}
          </p>
          <Pagination
            currentPage={productsStore.page}
            totalPages={productsStore.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  )
})
