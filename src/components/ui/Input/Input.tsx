import { InputHTMLAttributes, useId } from 'react'
import clsx from 'clsx'
import styles from './Input.module.css'

export type InputType = 'text' | 'email' | 'password'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  label,
  iconLeft,
  iconRight,
  className,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={clsx(
          styles.inputWrapper,
          error && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled
        )}
      >
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(styles.input, iconLeft && styles.inputWithIconLeft, iconRight && styles.inputWithIconRight, className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
