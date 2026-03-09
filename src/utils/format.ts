export interface FormattedPrice {
  whole: string
  decimals: string
}

export function formatPrice(value: number, locale = 'ru-RU'): FormattedPrice {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
  const commaIdx = formatted.indexOf(',')
  if (commaIdx === -1) return { whole: formatted, decimals: '' }
  return {
    whole: formatted.slice(0, commaIdx + 1),
    decimals: formatted.slice(commaIdx + 1),
  }
}
