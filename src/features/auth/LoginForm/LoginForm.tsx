import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { observer } from 'mobx-react-lite'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useStores } from '../../../providers/StoresProvider'
import { loginSchema, type LoginFormData } from './validation'
import { EyeIcon, ClearIcon, UserIcon, LockIcon, EyeOffIcon } from './icons'
import LogoIcon from '../../../assets/logo.svg?react'
import styles from './LoginForm.module.css'

export const LoginForm = observer(function LoginForm() {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', remember: false },
  })

  const onSubmit = async (data: LoginFormData) => {
    await authStore.login(data.username, data.password, data.remember)
    if (authStore.isAuthenticated) {
      navigate('/products')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <LogoIcon className={styles.logo} aria-hidden />
        </div>
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              label="Логин"
              type="text"
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите логин"
              error={errors.username?.message}
              iconLeft={<UserIcon className={styles.inputIcon} />}
              iconRight={
                field.value ? (
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => field.onChange('')}
                    aria-label="Очистить"
                  >
                    <ClearIcon />
                  </button>
                ) : undefined
              }
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите пароль"
              error={errors.password?.message}
              iconLeft={<LockIcon className={styles.inputIcon} />}
              iconRight={
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {!showPassword ? <EyeOffIcon className={styles.inputIcon} /> : <EyeIcon className={styles.inputIcon} />}
                </button>
              }
            />
          )}
        />

        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span className={styles.checkboxText}>Запомнить данные</span>
            </label>
          )}
        />

        {authStore.error && (
          <div className={styles.apiError} role="alert">
            {authStore.error}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          Войти
        </Button>

        <p className={styles.separator}>или</p>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
            Создать
          </a>
        </p>
      </form>
    </div>
  )
})
