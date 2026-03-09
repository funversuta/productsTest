import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../../hooks/useDebounce'
import styles from './SearchInput.module.css'

export interface SearchInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchInput({
  value = '',
  onChange,
  placeholder = 'Найти',
  debounceMs = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)
  const isInitialMount = useRef(true)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}
