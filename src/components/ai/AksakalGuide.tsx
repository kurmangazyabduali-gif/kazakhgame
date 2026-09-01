'use client'

import React, { useState } from 'react'

const PROVERBS = [
  {
    kz: '«Білекпен бірді жығасың, біліммен мыңды жығасың!»',
    ru: 'Силой победоносен один, знанием — тысячи!',
  },
  {
    kz: '«Күш атасын танымас — қайратты бол балам!»',
    ru: 'Сила не признает авторитетов — будь волевым!',
  },
  {
    kz: '«Талаптыға нұр жауар — шыдамдылық жеңіске жеткізер!»',
    ru: 'Стремящемуся сопутствует успех — терпение приведет к победе!',
  },
  {
    kz: '«Қол ұстасқан жығылмас — бірлік бар жерде тірлік бар!»',
    ru: 'Держащиеся за руки не упадут — где единство, там успех!',
  },
  {
    kz: '«Жамбы атуда көз мергендігі, жүрек сабырлығы керек!»',
    ru: 'В стрельбе необходимы зоркость глаза и спокойствие сердца!',
  },
]

export default function AksakalGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  const currentProverb = PROVERBS[quoteIndex]

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % PROVERBS.length)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto select-none">
      {/* Expanded Speech Bubble */}
      {isOpen && (
        <div className="mb-3 max-w-xs sm:max-w-sm bg-gray-900/95 border-2 border-yellow-500 rounded-2xl p-4 shadow-2xl text-white backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👴</span>
              <span className="font-black text-yellow-400 text-sm">ИИ-АҚСАҚАЛ НАСИХАТЫ</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-gray-800"
            >
              ✕
            </button>
          </div>

          <p className="text-sm font-semibold text-amber-200 italic mb-1.5">
            {currentProverb.kz}
          </p>
          <p className="text-xs text-gray-400 mb-3">
            {currentProverb.ru}
          </p>

          <button
            onClick={nextQuote}
            className="w-full py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>🔄</span> КЕЛЕСІ НАСИХАТ (СЛЕДУЮЩИЙ СОВЕТ)
          </button>
        </div>
      )}

      {/* Floating Aksakal Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-black px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.5)] border-2 border-yellow-200 hover:scale-105 active:scale-95 transition-all"
        title="Ақсақал кеңесін алу"
      >
        <span className="text-2xl">👴</span>
        <span className="text-xs font-black tracking-wider uppercase hidden sm:inline">
          АҚСАҚАЛ КЕҢЕСІ
        </span>
      </button>
    </div>
  )
}
