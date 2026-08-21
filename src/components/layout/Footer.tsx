import Link from 'next/link'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

export function Footer() {
  return (
    <footer className="w-full border-t border-border/10 bg-background mt-auto relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('/textures/sand.png')] mix-blend-overlay" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <KazakhOrnament variant="tumar" animate="float" className="w-[400px] h-[400px] text-gold" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href="/" className="text-2xl font-display font-bold tracking-widest uppercase mb-6 text-foreground hover:text-gold transition-colors duration-500">
              ULY DALA
            </Link>
            <p className="text-sm text-text-muted leading-relaxed font-heading tracking-wide">
              Премиальная цифровая платформа, посвящённая национальным играм и культурному наследию Казахстана.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-bold mb-6 uppercase text-xs tracking-widest text-gold">Платформа</h3>
            <ul className="space-y-4 text-sm font-heading tracking-wider text-text-muted">
              <li><Link href="/games" className="hover:text-foreground transition-colors duration-300">Библиотека игр</Link></li>
              <li><Link href="/map" className="hover:text-foreground transition-colors duration-300">Карта Казахстана</Link></li>
              <li><Link href="/championship" className="hover:text-foreground transition-colors duration-300">Чемпионат</Link></li>
              <li><Link href="/showcase" className="text-gold hover:text-gold-muted transition-colors duration-300">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-6 uppercase text-xs tracking-widest text-gold">Игроку</h3>
            <ul className="space-y-4 text-sm font-heading tracking-wider text-text-muted">
              <li><Link href="/profile" className="hover:text-foreground transition-colors duration-300">Профиль</Link></li>
              <li><Link href="/profile/achievements" className="hover:text-foreground transition-colors duration-300">Достижения</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-foreground transition-colors duration-300">AI Ұстаз</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-6 uppercase text-xs tracking-widest text-gold">Правовая информация</h3>
            <ul className="space-y-4 text-sm font-heading tracking-wider text-text-muted">
              <li><span className="cursor-not-allowed opacity-50 hover:opacity-100 transition-opacity">Пользовательское соглашение</span></li>
              <li><span className="cursor-not-allowed opacity-50 hover:opacity-100 transition-opacity">Политика конфиденциальности</span></li>
              <li><span className="cursor-not-allowed opacity-50 hover:opacity-100 transition-opacity">Источники</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted font-heading uppercase tracking-widest">
          <p className="opacity-70">© {new Date().getFullYear()} ULY DALA. Все права защищены.</p>
          <div className="flex gap-6">
            <span className="text-foreground border-b border-gold/50 cursor-pointer">Қазақша</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Русский</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">English</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
