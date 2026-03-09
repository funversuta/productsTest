import { LoginForm } from '../../features/auth/LoginForm/LoginForm'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  )
}
