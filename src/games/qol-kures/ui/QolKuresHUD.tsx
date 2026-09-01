'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQolKuresStore } from '../store/useQolKuresStore'
import { LEVELS, getLevelConfig } from '../levels/config'
import { Award, RotateCcw, ChevronRight, Zap, Play, CheckCircle } from 'lucide-react'

export function QolKuresHUD() {
  const {
    gameStatus,
    levelConfig,
    round,
    playerWins,
    aiWins,
    physicsState,
    lastBurstQuality,
    scoreResult,
    startRound,
    startMatch,
    selectLevel,
    attemptBurst,
    attemptComeback,
    levelId
  } = useQolKuresStore()

  const {
    playerStamina,
    aiStamina,
    playerFatigue,
    aiFatigue,
    position,
    burstWindowActive,
    burstWindowProgress,
    comebackActive,
    pinProgress,
    pinSide
  } = physicsState

  const isPlayerWinning = position > 0

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none z-30 font-body-premium">
      {/* 1. Top HUD: Rounds, score, and level details */}
      <div className="w-full flex items-center justify-between pointer-events-auto bg-black/60 backdrop-blur-md border border-[rgba(255,230,153,0.15)] p-4 rounded-2xl shadow-xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-[#ffe699]/60 font-bold">Деңгей {levelId} / 8</span>
          <span className="text-sm font-black uppercase text-[#fff8e6]">{levelConfig.title}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">Раунд {round}</span>
          <span className="text-lg font-black text-white tracking-widest">
            {playerWins} : {aiWins}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Қарсылас</span>
          <span className="text-sm font-black text-white">{levelConfig.aiName}</span>
        </div>
      </div>

      {/* 2. Stamina Bars */}
      <div className="w-full flex justify-between gap-12 mt-3">
        {/* Player Stamina (Left) */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold tracking-wider text-[#ffe699] uppercase">СЕН (Stamina)</span>
            <span className="text-[10px] font-bold text-white">{Math.floor(playerStamina)}%</span>
          </div>
          <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
            <motion.div
              style={{ width: `${playerStamina}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
            />
          </div>
          {playerFatigue > 45 && (
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-1 animate-pulse">
              Бұлшықет талуы: {Math.floor(playerFatigue)}%
            </span>
          )}
        </div>

        {/* AI Stamina (Right) */}
        <div className="flex flex-col flex-1 items-end">
          <div className="flex justify-between items-center w-full mb-1">
            <span className="text-[10px] font-bold text-white">{Math.floor(aiStamina)}%</span>
            <span className="text-[10px] font-bold tracking-wider text-rose-300 uppercase">AI (Stamina)</span>
          </div>
          <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
            <motion.div
              style={{ width: `${aiStamina}%` }}
              className="h-full bg-gradient-to-l from-rose-500 to-red-400 rounded-full ml-auto"
            />
          </div>
          {aiFatigue > 45 && (
            <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-1 animate-pulse">
              AI талуы: {Math.floor(aiFatigue)}%
            </span>
          )}
        </div>
      </div>

      {/* 3. Central Dynamic Action Prompts (Pin Press, Burst feedback, Comebacks) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence>
          {/* HIGH TENSION PIN PRESS BAR */}
          {pinProgress > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 p-5 rounded-3xl border-2 border-amber-400 max-w-xs w-full text-center shadow-2xl pointer-events-auto flex flex-col items-center gap-3"
            >
              <span className={`text-xs font-black uppercase tracking-widest animate-pulse ${
                pinSide === 'player' ? 'text-green-400' : 'text-red-500'
              }`}>
                {pinSide === 'player' ? 'ҚАРСЫЛАСТЫ ЖЫҚ: БАСЫП ТҰР!' : 'БАСЫП ЖАТЫР: ҚАРСЫЛАС!'}
              </span>
              <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-white/15 p-0.5">
                <motion.div
                  style={{ width: `${pinProgress * 100}%` }}
                  className={`h-full rounded-full ${
                    pinSide === 'player' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-rose-400'
                  }`}
                />
              </div>
              <span className="text-[10px] font-black text-white/60 tracking-wider">
                {Math.floor(pinProgress * 100)}% HOLD
              </span>
            </motion.div>
          )}

          {lastBurstQuality && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className={`font-display-premium text-4xl font-black uppercase tracking-widest ${
                lastBurstQuality === 'PERFECT' ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]' :
                lastBurstQuality === 'GOOD' ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              {lastBurstQuality === 'PERFECT' ? 'ТАМАША!' :
               lastBurstQuality === 'GOOD' ? 'ЖАҚСЫ!' : 'БАТПАДЫ'}
            </motion.div>
          )}

          {/* COMEBACK FLASHING OPTION */}
          {comebackActive && gameStatus === 'PLAYING' && (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: [1, 1.08, 1], opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={attemptComeback}
              className="pointer-events-auto bg-amber-600 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest border border-white/20 shadow-2xl animate-pulse cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              КАМБЕК! ТЕЗ БАС!
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Controls & Hand Progress slider */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Horizontal center bar representation */}
        <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
          <span className="text-[9px] font-black tracking-wider text-rose-400 uppercase">AI</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full relative flex items-center">
            {/* Center mark */}
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-3 bg-white/30 rounded-full" />
            
            {/* Winning/Losing regions color bar */}
            <div 
              style={{
                left: position > 0 ? '50%' : `${(position + 1) * 50}%`,
                width: `${Math.abs(position) * 50}%`
              }}
              className={`absolute h-full rounded-full ${
                isPlayerWinning ? 'bg-green-500/40' : 'bg-red-500/40'
              }`}
            />

            {/* Hand slider knob */}
            <motion.div
              animate={{ left: `${(position + 1) * 50}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className={`absolute -translate-x-1/2 w-5 h-5 rounded-full border border-white shadow-xl flex items-center justify-center ${
                isPlayerWinning ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white opacity-80" />
            </motion.div>
          </div>
          <span className="text-[9px] font-black tracking-wider text-green-400 uppercase">СЕН</span>
        </div>

        {/* Perfect burst window trigger circle */}
        <div className="w-full flex items-center justify-between max-w-xs pointer-events-auto">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed max-w-[130px]">
            {gameStatus === 'PLAYING' && 'Бос орын (Space) басып тұрыңыз'}
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <AnimatePresence>
              {burstWindowActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={attemptBurst}
                  className="w-14 h-14 rounded-full border-4 border-amber-400 bg-amber-400/20 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform"
                >
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="stroke-amber-400 fill-none"
                      strokeWidth="4"
                      strokeDasharray="150.7"
                      strokeDashoffset={150.7 * (1 - burstWindowProgress)}
                    />
                  </svg>
                  <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">РЫВОК</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 5. Screens Overlays (READY / END / FINISH) */}
      <AnimatePresence>
        {gameStatus === 'READY' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#FBF9F3] p-8 rounded-3xl max-w-lg w-full border border-[rgba(33,28,21,0.15)] shadow-2xl home-grain text-[#211C15]"
            >
              <h2 className="text-3xl font-black uppercase tracking-wider mb-2 text-center text-[var(--home-ink)]">
                ҚОЛ КҮРЕС 2.0
              </h2>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-black text-center mb-6">
                Президенттік көрме раунды
              </p>

              {/* Level / Opponent list selection view */}
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-2">
                  Қарсыласты таңдаңыз:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {LEVELS.map(level => {
                    const isSelected = level.id === levelId
                    return (
                      <button
                        key={level.id}
                        onClick={() => selectLevel(level.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-100 border-amber-500 shadow-md' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase text-gray-500">
                          Деңгей {level.id} ({level.difficulty})
                        </span>
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {level.aiName}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[rgba(33,28,21,0.03)] border p-4 rounded-xl text-xs space-y-2 mb-6">
                <div className="flex gap-2">🟢 <b>Басып тұр (Hold):</b> Күш салу / қысым</div>
                <div className="flex gap-2">⚪ <b>Жібер (Release):</b> Күшті қалпына келтіру (Stamina)</div>
                <div className="flex gap-2">🟡 <b>Рывок (Timing):</b> Алтын сәтте басып қалу</div>
              </div>

              <button
                onClick={startMatch}
                className="w-full py-4 bg-gray-900 text-[#FBF9F3] rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Белдесуді бастау
              </button>
            </motion.div>
          </motion.div>
        )}

        {gameStatus === 'ROUND_END' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-[#FBF9F3] p-8 rounded-3xl text-center max-w-sm w-full border border-[rgba(33,28,21,0.15)] shadow-2xl home-grain text-[#211C15]"
            >
              <h2 className="text-2xl font-black uppercase tracking-wider mb-2 text-gray-900">
                Раунд {round - 1} Аяқталды
              </h2>
              
              <p className="text-base font-bold mb-8 text-amber-600">
                Осы раундтағы жеңімпаз: {physicsState.winner === 'player' ? 'СЕН!' : levelConfig.aiName}
              </p>

              <button
                onClick={startRound}
                className="w-full py-4 bg-gray-900 text-[#FBF9F3] rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                Келесі раунд
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {gameStatus === 'MATCH_OVER' && scoreResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-[#FBF9F3] p-8 rounded-3xl text-center max-w-sm w-full border border-[rgba(33,28,21,0.15)] shadow-2xl home-grain text-[#211C15]"
            >
              <Award className="w-14 h-14 text-amber-500 mx-auto mb-3" />
              <h2 className="text-3xl font-black uppercase tracking-wider mb-2 text-gray-900">
                {scoreResult.stars > 0 ? 'ЖЕҢІС!' : 'ЖЕҢІЛІС'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-5">
                Белдесу қорытындысы
              </p>

              <div className="flex justify-center gap-1.5 mb-5">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={`text-3xl ${s <= scoreResult.stars ? 'text-amber-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>

              <div className="bg-[rgba(33,28,21,0.03)] border p-4 rounded-xl mb-6 text-left text-xs space-y-3">
                <div className="flex justify-between font-medium">
                  <span>Жалпы ұпай:</span>
                  <span className="font-bold text-gray-900">{scoreResult.score}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Тәжірибе (XP):</span>
                  <span className="font-bold text-emerald-500">+{scoreResult.xpEarned} XP</span>
                </div>
                {scoreResult.unlockedAchievements.length > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <span className="font-bold text-amber-600 uppercase tracking-wide block mb-1">Жаңа жетістіктер:</span>
                    <div className="flex flex-wrap gap-1">
                      {scoreResult.unlockedAchievements.map(ach => (
                        <span key={ach} className="bg-amber-100 text-amber-600 text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => selectLevel(levelId)}
                  className="flex-1 py-3.5 bg-white border border-[rgba(33,28,21,0.2)] text-gray-900 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[rgba(33,28,21,0.04)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Реванш
                </button>
                <button
                  onClick={() => selectLevel(Math.min(8, levelId + 1))}
                  className="flex-1 py-3.5 bg-gray-900 text-[#FBF9F3] rounded-xl font-bold uppercase tracking-wider text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Келесі деңгей
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
