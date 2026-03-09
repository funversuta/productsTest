import { useState } from 'react'
import clsx from 'clsx'
import type { Product } from '../../../types/product'
import type { SortField, SortOrder } from '../../../types'
import PlusIcon from '../../../assets/+.svg?react'

import styles from './ProductsTable.module.css'
import { formatPrice } from '../../../utils/format'

export type { SortField }

export interface ProductsTableProps {
  products: Product[]
  sortBy: SortField | null
  order: SortOrder
  onSort: (field: SortField) => void
}

const AddToBasket = () => {}
const onMoreActions = () => {}

export function ProductsTable({ products, sortBy, order, onSort }: ProductsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id))
  const someSelected = products.some((p) => selectedIds.has(p.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const SortHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <th className={className}>
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => onSort(field)}
      >
        {children}
        {sortBy === field && (
          <span className={styles.sortIcon}>{order === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    </th>
  )

  if (products.length === 0) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.cellCheckbox}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected
                }}
                onChange={toggleAll}
                aria-label="Выбрать все"
              />
            </th>
            <SortHeader field="title" className={styles.cellNameColumn}>
              Наименование
            </SortHeader>
            <SortHeader field="brand" className={styles.cellVendor}>Вендор</SortHeader>
            <th className={styles.cellSku}>Артикул</th>
            <SortHeader field="rating" className={styles.cellRating}>Оценка</SortHeader>
            <SortHeader field="price" className={styles.cellPrice}>Цена, ₽</SortHeader>
            <th className={styles.cellActions} aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={clsx(selectedIds.has(product.id) && styles.rowSelected)}>
              <td className={styles.cellCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => toggleOne(product.id)}
                  aria-label={`Выбрать ${product.title}`}
                />
              </td>
              <td className={styles.cellNameColumn}>
                <div className={styles.cellName}>
                  {(product.thumbnail ?? product.images?.[0]) ? (
                    <>
                      <img
                        src={product.thumbnail ?? product.images?.[0]}
                        alt=""
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.classList.add(styles.productImageHidden)
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement | null
                          placeholder?.classList.remove(styles.productImageHidden)
                        }}
                      />
                      <div className={`${styles.productImagePlaceholder} ${styles.productImageHidden}`} aria-hidden />
                    </>
                  ) : (
                    <div className={styles.productImagePlaceholder} aria-hidden />
                  )}
                  <div className={styles.productNameBlock}>
                    <span className={styles.productTitle}>{product.title}</span>
                    {product.category && (
                      <span className={styles.productCategory}>{product.category}</span>
                    )}
                  </div>
                </div>
              </td>
              <td className={styles.cellVendor}>{product.brand ? product.brand : '—'}</td>
              <td className={styles.cellSku}>{product.sku ?? '—'}</td>
              <td className={styles.cellRating}>
                <span className={styles.rating}>
                  {product.rating < 3 ? (
                    <>
                      <span className={styles.ratingLow}>{product.rating}</span>/5
                    </>
                  ) : (
                    <>{product.rating}/5</>
                  )}
                </span>
              </td>
              <td className={styles.cellPrice}>
                {(() => {
                  const { whole, decimals } = formatPrice(product.price)
                  return decimals ? (
                    <>
                      {whole}
                      <span className={styles.priceDecimals}>{decimals}</span>
                    </>
                  ) : (
                    whole
                  )
                })()}
              </td>
              <td className={styles.cellActions}>
                <div className={styles.cellActionsInner}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => AddToBasket()}
                    aria-label="Добавить в корзину"
                    title="Добавить в корзину"
                  >
                    <PlusIcon className={styles.actionPlusIcon} />
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtnSecondary}
                    onClick={() => onMoreActions()}
                    aria-label="Дополнительные действия"
                    title="Дополнительные действия"
                  >
                    <span className={styles.actionDots}>⋯</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
