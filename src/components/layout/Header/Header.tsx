import styles from './Header.module.css'

export interface HeaderProps {
  title?: string
  center?: React.ReactNode
  children?: React.ReactNode
}

export function Header({ title = 'Товары', center, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {center && <div className={styles.center}>{center}</div>}
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  )
}
