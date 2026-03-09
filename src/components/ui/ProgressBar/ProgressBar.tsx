import styles from './ProgressBar.module.css'

export function ProgressBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar} />
    </div>
  )
}
