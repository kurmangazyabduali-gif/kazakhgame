import React from 'react';
import { useArqanStore, Tactic, ArmorTier } from '../store/useArqanStore';

export default function ArqanHUD() {
  const store = useArqanStore();

  const getQualityText = (q: string | null) => {
    switch (q) {
      case 'PERFECT': return 'ТАМАША! 💪';
      case 'GOOD': return 'ЖАҚСЫ!';
      case 'LATE': return 'КЕШ!';
      case 'MISS': return 'ТЫМ ЕРТЕ!';
      case 'OVERHEAT': return 'ҰСТАМАДЫҢЫЗ!';
      default: return '';
    }
  };

  const getQualityColor = (q: string | null) => {
    switch (q) {
      case 'PERFECT': return 'text-yellow-400 scale-110';
      case 'GOOD': return 'text-green-400';
      case 'OVERHEAT': return 'text-orange-500';
      case 'MISS': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const chargePercent = Math.min(100, Math.round(store.chargePower));
  const isRhythmPeak = store.rhythmBeat >= 0.35 && store.rhythmBeat <= 0.65;
  const isZhigerReady = store.zhigerMeter >= 100 && !store.isZhigerActive;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 font-sans text-white select-none z-10">
      
      {/* TUTORIAL OVERLAY */}
      {store.showTutorial && store.status === 'READY' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 pointer-events-auto">
          <div className="bg-gray-900/95 border-2 border-yellow-500 rounded-2xl p-8 max-w-lg text-center shadow-2xl">
            <h2 className="text-4xl font-black text-yellow-400 mb-4">🏆 АРҚАН ТАРТЫС 3D</h2>
            <div className="text-left space-y-3 text-base">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <span><b className="text-yellow-300">БАСЫП ТҰРЫҢЫЗ</b> — Күш жинау үшін экранды ұстаңыз</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <span><b className="text-yellow-300">РЫТМ ("1-2, ТАРТ!")</b> — Орталық пульс алтын болғанда жіберіңіз!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <span><b className="text-yellow-400">«ЖІГЕР» АУРАСЫ</b> — Шкала толғанда 6 секундтық шексіз энергияны қосыңыз!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <span><b className="text-yellow-400">ДУЭЛЬ 1-в-1</b> — 1-1 есебінде 3-раунд Капитандар Дуэліне айналады!</span>
              </div>
            </div>
            <button
              className="mt-6 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl rounded-xl transition-colors shadow-lg active:scale-95"
              onClick={() => store.dismissTutorial()}
            >
              ТҮСІНДІМ, БАСТАЙЫҚ!
            </button>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto">
        <div className="text-2xl font-bold drop-shadow-md bg-black/50 border border-yellow-500/30 px-4 py-1.5 rounded-xl">
          {store.isCaptainDuel ? (
            <span className="text-red-400 animate-pulse font-black">⚔️ КАПИТАНДАР ДУЭЛІ (1v1)</span>
          ) : (
            `РАУНД ${store.round} / 3`
          )}
        </div>
        <div className="text-3xl font-black drop-shadow-lg tracking-wider bg-black/50 border border-yellow-500/30 px-6 py-1.5 rounded-xl">
          <span className="text-yellow-400">СЕН</span> {store.playerWins} — {store.aiWins} <span className="text-blue-400">AI</span>
        </div>
      </div>

      {/* Stamina & ЖІГЕР Hype Bars */}
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto mt-2 gap-8">
        <div className="flex-1 space-y-1.5">
          <div className="text-sm font-semibold drop-shadow-md flex justify-between">
            <span>⚡ СЕНІҢ КҮШІҢ {store.isZhigerActive && <b className="text-yellow-300 animate-pulse">★ ЖІГЕР РЕЖИМІ! ★</b>}</span>
            {store.activeTactic === 'REST' && <span className="text-green-400 opacity-90">ТЫНЫС АЛУДА...</span>}
            {store.activeTactic === 'BRACE' && <span className="text-blue-400 opacity-90">ТІРЕЛУДЕ (БЛОК)...</span>}
            {store.activeTactic === 'BURST' && <span className="text-yellow-400 opacity-90">ШАБУЫЛ!</span>}
          </div>
          <div className="h-3.5 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                store.isZhigerActive
                  ? 'bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                  : store.playerFatigue > 0.7 ? 'bg-red-500' : store.playerFatigue > 0.4 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.max(0, (1 - store.playerFatigue) * 100)}%` }}
            />
          </div>

          {/* ЖІГЕР Hype Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-yellow-400">🔥 ЖІГЕР:</span>
            <div className="h-2 flex-1 bg-gray-900 rounded-full border border-yellow-600/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-200"
                style={{ width: `${store.zhigerMeter}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 text-right space-y-1.5">
          <div className="text-sm font-semibold drop-shadow-md">AI КҮШІ ⚡</div>
          <div className="h-3.5 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all duration-100 float-right"
              style={{ width: `${Math.max(0, (1 - store.aiFatigue) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Section: Quality Text & Results */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        {store.lastPullQuality && (
          <div className={`text-6xl font-black italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] transition-all animate-bounce ${getQualityColor(store.lastPullQuality)}`}>
            {getQualityText(store.lastPullQuality)}
          </div>
        )}

        {/* ЖІГЕР TRIGGER BUTTON */}
        {isZhigerReady && store.status === 'PULLING' && (
          <button
            onClick={(e) => { e.stopPropagation(); store.activateZhiger(); }}
            className="pointer-events-auto px-8 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-black text-xl rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.9)] border-2 border-yellow-200 animate-pulse active:scale-95"
          >
            ⚡ ЖІГЕРДІ БЕЛСЕНДІРУ! (6с ШЕКСІЗ КҮШ)
          </button>
        )}
        
        {store.status === 'ROUND_END' && (
          <div className="flex flex-col items-center pointer-events-auto bg-black/80 p-8 rounded-2xl backdrop-blur-md shadow-2xl border border-white/20">
            <div className="text-5xl font-bold mb-6 drop-shadow-lg">
              {store.ropePosition > 0 ? '🎉 РАУНДТЫ ЖЕҢДІҢІЗ!' : '😤 AI ЖЕҢДІ!'}
            </div>
            <button
              className="px-10 py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-2xl rounded-xl transition-colors shadow-lg active:scale-95"
              onPointerDown={(e) => { e.stopPropagation(); store.startRound(); }}
            >
              КЕЛЕСІ РАУНД →
            </button>
          </div>
        )}

        {store.status === 'MATCH_OVER' && (
          <div className="flex flex-col items-center pointer-events-auto bg-black/85 p-8 rounded-2xl backdrop-blur-md shadow-2xl border border-yellow-500/50">
            <div className="text-6xl font-black mb-6 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              {store.playerWins > store.aiWins ? '🏆 СІЗ ЖЕҢДІҢІЗ!' : '😤 AI ЖЕҢДІ'}
            </div>
            <button
              className="px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-2xl rounded-xl transition-colors shadow-lg active:scale-95"
              onPointerDown={(e) => { e.stopPropagation(); store.startMatch(); }}
            >
              ҚАЙТА ОЙНАУ
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center pb-4 gap-3">
        
        {/* Rope Position Indicator */}
        <div className="w-full relative h-10 flex items-center">
          <div className="absolute left-0 right-0 h-3.5 bg-amber-900/90 border border-amber-600 rounded-full shadow-inner" />
          <div className="absolute left-1/2 -top-3 -bottom-3 w-1 bg-white/60 -translate-x-1/2" />
          <div className="absolute right-0 w-2 h-7 bg-yellow-400 rounded top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          <div className="absolute left-0 w-2 h-7 bg-blue-400 rounded top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          
          <div
            className="absolute h-7 w-7 bg-yellow-300 rotate-45 border-2 border-amber-950 shadow-xl z-10 transition-all duration-100"
            style={{ 
              left: `${50 + (store.ropePosition / 100) * 50}%`,
              transform: 'translateX(-50%) rotate(45deg)'
            }}
          />
        </div>

        {/* TACTICAL COMMAND BUTTONS */}
        {store.status === 'PULLING' && (
          <div className="flex gap-4 pointer-events-auto my-1 z-20">
            <button
              disabled={store.tacticCooldown > 0}
              onClick={(e) => { e.stopPropagation(); store.triggerTactic('BURST'); }}
              className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2 border ${
                store.tacticCooldown > 0
                  ? 'bg-gray-800 text-gray-500 border-gray-700'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-300 shadow-yellow-500/20'
              }`}
            >
              <span>⚡</span> ШАБУЫЛ (BURST)
            </button>

            <button
              disabled={store.tacticCooldown > 0}
              onClick={(e) => { e.stopPropagation(); store.triggerTactic('BRACE'); }}
              className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2 border ${
                store.tacticCooldown > 0
                  ? 'bg-gray-800 text-gray-500 border-gray-700'
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-blue-500/20'
              }`}
            >
              <span>🛡️</span> ТІРЕЛУ (BRACE)
            </button>

            <button
              disabled={store.tacticCooldown > 0}
              onClick={(e) => { e.stopPropagation(); store.triggerTactic('REST'); }}
              className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2 border ${
                store.tacticCooldown > 0
                  ? 'bg-gray-800 text-gray-500 border-gray-700'
                  : 'bg-green-600 hover:bg-green-500 text-white border-green-400 shadow-green-500/20'
              }`}
            >
              <span>💨</span> ТЫНЫС АЛУ (REST)
            </button>
          </div>
        )}

        {/* Charge Bar & Rhythm Ring */}
        {store.status === 'PULLING' && (
          <div className="w-full max-w-md bg-black/70 px-5 py-3 rounded-xl backdrop-blur-md shadow-xl border border-white/10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full transition-all ${isRhythmPeak ? 'bg-yellow-400 scale-125 shadow-[0_0_8px_rgba(250,204,21,0.9)]' : 'bg-gray-600'}`} />
              <span className="text-xs font-bold text-gray-300">
                {isRhythmPeak ? <span className="text-yellow-400 animate-pulse">★ РЫТМ ШЫҢЫ — ТАРТ! ★</span> : 'РЫТМ КҮТІҢІЗ...'}
              </span>
            </div>

            <div className="w-full h-5 bg-gray-800 rounded-full border border-gray-600 overflow-hidden relative">
              <div className="absolute right-0 w-[40%] h-full bg-yellow-500/30 border-l-2 border-yellow-400/80" />
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-75 rounded-full ${
                  store.chargePower >= 55 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-blue-500'
                }`}
                style={{ width: `${chargePercent}%` }}
              />
            </div>
          </div>
        )}
        
        {store.status === 'READY' && !store.showTutorial && (
          <div className="flex flex-col items-center gap-4 pointer-events-auto">
            {/* Armor Customization Toggle */}
            <div className="flex bg-black/70 p-1.5 rounded-xl border border-white/20 gap-2">
              <button
                onClick={() => store.setArmorTier('STANDARD')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  store.armorTier === 'STANDARD' ? 'bg-yellow-500 text-black shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🥋 ДӘСТҮРЛІ КИІМ
              </button>
              <button
                onClick={() => store.setArmorTier('HEAVY_ARMOR')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  store.armorTier === 'HEAVY_ARMOR' ? 'bg-yellow-500 text-black shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                ⚔️ БАТЫР САУЫТЫ (+15% КҮШ)
              </button>
            </div>

            <button
              className="px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-colors active:scale-95 shadow-xl text-3xl"
              onPointerDown={(e) => { e.stopPropagation(); store.startRound(); }}
            >
              ▶ БАСТАУ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
