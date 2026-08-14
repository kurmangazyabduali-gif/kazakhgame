import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">ULY DALA</Link>
          <div className="hidden md:flex gap-4">
            <Link href="/games" className="text-muted-foreground hover:text-foreground">Игры</Link>
            <Link href="/traditions" className="text-muted-foreground hover:text-foreground">Традиции</Link>
            <Link href="/map" className="text-muted-foreground hover:text-foreground">Қазақстан</Link>
            <Link href="/championship" className="text-muted-foreground hover:text-foreground">Чемпионат</Link>
            <Link href="/ai-mentor" className="text-muted-foreground hover:text-foreground">AI Mentor</Link>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-foreground">Профиль</Link>
              <form action="/auth/actions" method="POST">
                {/* Note: In a real app we'd use a server action bound to a button, we'll do this via client later or standard form */}
                <Link href="/auth/actions" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                  Выйти
                </Link>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
