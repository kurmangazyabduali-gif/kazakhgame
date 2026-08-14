import Link from 'next/link'
import { signup } from '../actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signup}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Регистрация в ULY DALA</h2>
        
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 text-foreground"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-md" htmlFor="password">
          Пароль
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 text-foreground"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button className="bg-primary text-primary-foreground font-semibold rounded-md px-4 py-2 text-foreground mb-2">
          Создать аккаунт
        </button>
        
        {message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {message}
          </p>
        )}
        
        <div className="text-center mt-4 text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="underline font-semibold">
            Войти
          </Link>
        </div>
      </form>
    </div>
  )
}
