export type SortOrder = 'asc' | 'desc'

export type SortField = 'title' | 'price' | 'brand' | 'rating'

const SORT_FIELDS: SortField[] = ['title', 'price', 'brand', 'rating']

export function parseSortField(value: string | null): SortField | null {
  return value && SORT_FIELDS.includes(value as SortField) ? (value as SortField) : null
}

export interface UrlFilterUpdates {
  page?: number
  sortBy?: string | null
  order?: SortOrder
  q?: string
}
