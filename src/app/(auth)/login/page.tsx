import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <KazakhOrnament variant="tumar" className="w-full h-full" animate="spin" />
      </div>
      
      <MaterialSurface material="felt" className="w-full max-w-md p-8 rounded-3xl relative z-10 border border-gold/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gold mb-2">Кіру</h1>
          <p className="font-heading text-text-muted text-sm uppercase tracking-widest">С возвращением в ULY DALA</p>
        </div>

        {searchParams.error && (
          <div className="bg-terracotta/10 border border-terracotta/50 text-terracotta text-sm p-4 rounded-xl mb-6">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="space-y-6">
          <div className="space-y-2">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="batyr@steppes.kz"
              className="w-full bg-surface-elevated border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Пароль</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full bg-surface-elevated border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <HeritageButton type="submit" variant="primary" className="w-full">
            ВОЙТИ
          </HeritageButton>
        </form>

        <div className="mt-8 text-center border-t border-border/50 pt-6">
          <p className="text-sm text-text-muted">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-gold font-bold hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </MaterialSurface>
    </div>
  )
}
