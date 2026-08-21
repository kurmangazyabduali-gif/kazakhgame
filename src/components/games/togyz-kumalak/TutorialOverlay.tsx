'use client'

import { AIDifficulty, GameMode } from '@/games/togyz-kumalak/engine/types'

interface TutorialOverlayProps {
  onStart: (mode: GameMode, difficulty: AIDifficulty, scenario: number) => void
}

export default function TutorialOverlay({ onStart }: TutorialOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-3xl p-8 border border-stone-600/30 shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ background: 'linear-gradient(135deg, #1a0f08 0%, #2c1a0e 100%)' }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-amber-400 mb-2 tracking-tight">ТОҒЫЗҚҰМАЛАҚ</div>
          <div className="text-stone-400 text-sm">Национальная стратегическая игра Казахстана</div>
        </div>

        {/* Rules summary */}
        <div className="space-y-3 mb-8 text-sm">
          {[
            { icon: '♟', title: 'Доска', desc: '18 отау (ям) — по 9 у каждого. В каждой по 9 құмалақ (камней) вначале.' },
            { icon: '↻', title: 'Ход', desc: 'Выбери отау. Если камней > 1, один остаётся. Остальные сеются по кругу.' },
            { icon: '✦', title: 'Захват', desc: 'Если последний камень попадает в ЧЁТНУЮ яму соперника — ты берёшь все камни оттуда.' },
            { icon: '🏺', title: 'Тұздық', desc: 'Если в яме соперника оказывается ровно 3 камня — ты создаёшь тұздық. Всё, что туда попадает, твоё навсегда.' },
            { icon: '🏆', title: 'Победа', desc: 'Первый набравший 82+ камня в қазан побеждает!' },
          ].map(r => (
            <div key={r.title} className="flex gap-3 items-start bg-stone-800/30 rounded-xl p-3">
              <span className="text-lg mt-0.5">{r.icon}</span>
              <div>
                <span className="text-amber-300 font-semibold">{r.title}: </span>
                <span className="text-stone-300">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mode selection */}
        <div className="space-y-4">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-widest text-center mb-3">Выбери режим</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Practice scenarios */}
            <div className="space-y-2">
              <div className="text-stone-500 text-xs font-medium mb-2">Обучение</div>
              {[
                { label: 'Сценарий 1 — Первый ход', s: 1 },
                { label: 'Сценарий 2 — Захват', s: 2 },
                { label: 'Сценарий 3 — Тұздық', s: 3 },
              ].map(({ label, s }) => (
                <button
                  key={s}
                  onClick={() => onStart('practice', 'easy', s)}
                  className="w-full py-2.5 px-4 bg-stone-700/50 hover:bg-stone-600/60 text-stone-200 text-sm font-medium rounded-xl transition-all border border-stone-600/20 text-left"
                >
                  📖 {label}
                </button>
              ))}
            </div>

            {/* Match modes */}
            <div className="space-y-2">
              <div className="text-stone-500 text-xs font-medium mb-2">Партия против AI</div>
              {[
                { label: 'Лёгкий AI', diff: 'easy' as AIDifficulty, icon: '🌱' },
                { label: 'Средний AI', diff: 'medium' as AIDifficulty, icon: '⚔️' },
                { label: 'Сложный AI', diff: 'hard' as AIDifficulty, icon: '🔥' },
              ].map(({ label, diff, icon }) => (
                <button
                  key={diff}
                  onClick={() => onStart('match', diff, 1)}
                  className="w-full py-2.5 px-4 bg-amber-900/30 hover:bg-amber-800/40 text-amber-200 text-sm font-medium rounded-xl transition-all border border-amber-700/20 text-left"
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

