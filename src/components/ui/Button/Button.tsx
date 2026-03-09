import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

export function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  )
}
