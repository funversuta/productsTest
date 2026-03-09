import styles from './Pagination.module.css'

const PAGINATION_MAX_VISIBLE = 5

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const pages: number[] = []
  let start = Math.max(1, currentPage - Math.floor(PAGINATION_MAX_VISIBLE / 2))
  let end = Math.min(totalPages, start + PAGINATION_MAX_VISIBLE - 1)
  if (end - start + 1 < PAGINATION_MAX_VISIBLE) {
    start = Math.max(1, end - PAGINATION_MAX_VISIBLE + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Предыдущая страница"
      >
        ←
      </button>
      <div className={styles.pages}>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? styles.pageActive : styles.page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.button}
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Следующая страница"
      >
        →
      </button>
    </div>
  )
}
