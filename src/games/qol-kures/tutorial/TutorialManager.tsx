'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Info, HelpCircle } from 'lucide-react'

interface TutorialProps {
  onDismiss: () => void
}

export function TutorialManager({ onDismiss }: TutorialProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[#FBF9F3] text-[#211C15] p-8 rounded-3xl border border-[rgba(33,28,21,0.15)] shadow-2xl relative overflow-hidden home-grain"
      >
        {/* Background Kazakh Ornament element for premium feel */}
        <div className="absolute -right-16 -top-16 text-amber-600/5 pointer-events-none select-none">
          <svg className="w-48 h-48 fill-current" viewBox="0 0 100 100">
            <path d="M50 0C60 20 80 20 100 50C80 80 60 80 50 100C40 80 20 80 0 50C20 20 40 20 50 0Z" />
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-6 text-amber-600 font-display-premium font-bold text-2xl uppercase tracking-wider">
          <HelpCircle className="w-7 h-7" />
          Қол Күрес Ережесі
        </div>

        <p className="font-body-premium text-[rgba(33,28,21,0.8)] leading-relaxed mb-6">
          Бұл жай ғана жылдам басу ойыны емес. Жеңіске жету үшін күш, төзімділік пен тактика керек!
        </p>

        <div className="space-y-6 mb-8 font-body-premium">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-1 text-gray-900">Күш салу (Press)</h4>
              <p className="text-xs text-[rgba(33,28,21,0.7)] leading-normal">
                Бос орын (Space) пернесін немесе экранды <b>басып тұрыңыз</b>. Босатсаңыз, қысым тоқтайды.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-1 text-gray-900">Шыдамдылық (Stamina)</h4>
              <p className="text-xs text-[rgba(33,28,21,0.7)] leading-normal">
                Басып тұрғанда күшіңіз (Stamina) таусылады. Ол бітсе, бұлшықет шаршап, әлсірейсіз. Қалпына келу үшін қысымды <b>уақытында босатыңыз</b>.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-1 text-gray-900">Алтын сәт (Perfect Timing)</h4>
              <p className="text-xs text-[rgba(33,28,21,0.7)] leading-normal">
                Экранында алтын дөңгелек пайда болғанда ортасына дәл келгенде <b>басып қалсаңыз</b>, қарсыласқа күшті рывок (Perfect Push) жасайсыз.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-4 rounded-2xl bg-gray-900 text-[#FBF9F3] font-body-premium font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_-8px_rgba(33,28,21,0.3)]"
        >
          Түсінікті, бастау!
        </button>
      </motion.div>
    </div>
  )
}
