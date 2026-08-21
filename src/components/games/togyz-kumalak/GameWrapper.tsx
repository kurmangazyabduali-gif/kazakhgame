'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TogyzqumalakEngine } from '@/games/togyz-kumalak/engine/TogyzqumalakEngine'
import { TogyzqumalakState, TogyzqumalakMove, Player, AIDifficulty, GameMode, MoveRecord, MoveResult } from '@/games/togyz-kumalak/engine/types'
import { TogyzAI } from '@/games/togyz-kumalak/ai/TogyzAI'
import { useSowingAnimation } from './useSowingAnimation'
import Board3D from './Board3D'
import ResultScreen from './ResultScreen'
import TutorialOverlay from './TutorialOverlay'
import { guestStorage } from '@/lib/guestStorage'
import { ChevronDown, RefreshCcw } from 'lucide-react'

interface GameWrapperProps {
  sessionId: string
}

interface GameSession {
  state: TogyzqumalakState
  mode: GameMode
  difficulty: AIDifficulty
  humanPlayer: Player
  startTime: number
}

interface GameResultState {
  winner: Player | null
  isDraw: boolean
  totalCaptured: number
  tuzdykCreated: boolean
  duration: number
}

export default function GameWrapper({ sessionId }: GameWrapperProps) {
  const [showTutorial, setShowTutorial] = useState(true)
  const [session, setSession] = useState<GameSession | null>(null)
  const [selectedOtau, setSelectedOtau] = useState<number | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<GameResultState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const [pendingResult, setPendingResult] = useState<{ session: GameSession, result: MoveResult } | null>(null)

  const aiRef = useRef<TogyzAI | null>(null)
  const totalCapturedRef = useRef(0)
  const tuzdykCreatedRef = useRef(false)

  const handleAnimationComplete = useCallback(() => {
    if (pendingResult) {
      const { session: currentSession, result } = pendingResult
      
      setSession({
        ...currentSession,
        state: result.nextState,
      })
      
      if (result.gameEnded) {
        const duration = Date.now() - currentSession.startTime
        const captured = totalCapturedRef.current
        const tuzdyk = tuzdykCreatedRef.current
        setGameResult({
          winner: result.winner,
          isDraw: result.isDraw,
          totalCaptured: captured,
          tuzdykCreated: tuzdyk,
          duration,
        })
        submitResult(currentSession, result.nextState, result.winner, result.isDraw, captured, duration)
      }
      setPendingResult(null)
    }
  }, [pendingResult])

  const { visualState, animatingPit, isAnimating, startAnimation } = useSowingAnimation(
    session?.state || TogyzqumalakEngine.getInitialState(), 
    handleAnimationComplete
  )

  const startGame = useCallback((mode: GameMode, difficulty: AIDifficulty, scenario: number) => {
    const initialState = mode === 'practice'
      ? TogyzqumalakEngine.getPracticeState(scenario)
      : TogyzqumalakEngine.getInitialState()

    aiRef.current = new TogyzAI(difficulty)
    totalCapturedRef.current = 0
    tuzdykCreatedRef.current = false

    setSession({
      state: initialState,
      mode,
      difficulty,
      humanPlayer: 1,
      startTime: Date.now(),
    })
    setShowTutorial(false)
    setGameResult(null)
    setSelectedOtau(null)
    setIsAIThinking(false)
    setAiMessage(null)
    setShowHistory(false)
  }, [])

  const submitResult = useCallback(async (
    sess: GameSession,
    finalState: TogyzqumalakState,
    winner: Player | null,
    isDraw: boolean,
    captured: number,
    duration: number
  ) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/games/togyz-kumalak/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          winner,
          isDraw,
          humanPlayer: sess.humanPlayer,
          difficulty: sess.difficulty,
          mode: sess.mode,
          moveHistory: finalState.history,
        }),
      })
      const data = await response.json()
      if (data.success && !data.guest) {
        guestStorage.saveGameResult('togyz-kumalak', data.score || 0, data.xp || 0)
      }
    } catch (e) {
      console.error('Submit result error', e)
    } finally {
      setIsSubmitting(false)
    }
  }, [sessionId])

  const handleMoveResult = useCallback((currentSession: GameSession, result: MoveResult, move: TogyzqumalakMove) => {
    if (result.captured > 0 && currentSession.state.currentPlayer === currentSession.humanPlayer) {
      totalCapturedRef.current += result.captured
    }
    if (result.tuzdykCreated && currentSession.state.currentPlayer === currentSession.humanPlayer) {
      tuzdykCreatedRef.current = true
    }

    setPendingResult({ session: currentSession, result })
    startAnimation(currentSession.state, move, result.moveRecord, result.nextState)
    
  }, [startAnimation])

  const handlePlayerMove = useCallback((otauIndex: number) => {
    if (!session || isAIThinking || gameResult || isAnimating) return
    if (session.mode !== 'practice' && session.state.currentPlayer !== session.humanPlayer) return

    const move: TogyzqumalakMove = { player: session.state.currentPlayer, otauIndex }
    if (!TogyzqumalakEngine.isLegalMove(session.state, move)) return

    setSelectedOtau(null)
    const result = TogyzqumalakEngine.applyMove(session.state, move)
    handleMoveResult(session, result, move)
  }, [session, isAIThinking, gameResult, isAnimating, handleMoveResult])

  const handleOtauClick = useCallback((otauIndex: number) => {
    if (!session || isAIThinking || isAnimating) return
    if (selectedOtau === otauIndex) {
      handlePlayerMove(otauIndex)
    } else {
      setSelectedOtau(otauIndex)
    }
  }, [session, isAIThinking, selectedOtau, handlePlayerMove, isAnimating])

  useEffect(() => {
    if (!session || gameResult || isAIThinking || isAnimating) return
    if (session.state.currentPlayer === session.humanPlayer) return
    if (session.mode === 'practice') return

    const runAI = async () => {
      setIsAIThinking(true)
      setAiMessage('AI ҰСТАЗ ОЙЛАНЫП ЖАТЫР...')
      try {
        const move = await aiRef.current!.chooseMoveAsync(session.state)
        if (!move) { setIsAIThinking(false); setAiMessage(null); return }

        setAiMessage(`AI: Отау ${move.otauIndex + 1}`)
        const result = TogyzqumalakEngine.applyMove(session.state, move)
        handleMoveResult(session, result, move)
      } finally {
        setIsAIThinking(false)
        setTimeout(() => setAiMessage(null), 1500)
      }
    }

    runAI()
  }, [session?.state.currentPlayer, session?.humanPlayer, session?.mode, gameResult, isAIThinking, isAnimating, handleMoveResult])

  const handlePlayAgain = useCallback(() => {
    setShowTutorial(true)
    setSession(null)
    setGameResult(null)
  }, [])

  if (showTutorial) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0d0704]">
        <TutorialOverlay onStart={startGame} />
      </div>
    )
  }

  if (!session) return null

  const activeState = isAnimating ? visualState : session.state
  const legalMoves = TogyzqumalakEngine.getLegalMoves(activeState)
  
  const humanKazan = session.humanPlayer === 1 ? activeState.kazan.player1 : activeState.kazan.player2
  const aiKazan = session.humanPlayer === 1 ? activeState.kazan.player2 : activeState.kazan.player1

  const isHumanTurn = activeState.currentPlayer === session.humanPlayer

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080503] font-sans">
      {/* The Board is the Hero */}
      <Board3D
        state={activeState}
        legalMoves={new Set(legalMoves.map(m => m.otauIndex))}
        selectedOtau={selectedOtau}
        animatingOtau={animatingPit}
        humanPlayer={session.humanPlayer}
        onOtauClick={handleOtauClick}
      />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Top Bar (AI Info & Controls) */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <button onClick={() => setShowTutorial(true)} className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest transition-colors mb-2 text-left">
              &larr; Мәзір
            </button>
            <div className={`px-4 py-2 rounded-xl backdrop-blur-md border ${!isHumanTurn ? 'bg-[#1a0f08]/80 border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-black/40 border-stone-800'}`}>
              <div className="text-[10px] text-stone-500 uppercase tracking-widest">Қарсылас</div>
              <div className="text-lg text-stone-200 font-medium">AI ҰСТАЗ {session.difficulty === 'hard' ? '(Шебер)' : session.difficulty === 'medium' ? '(Шәкірт)' : '(Балдырған)'}</div>
              <div className="text-3xl text-[#d4af37] font-bold leading-none mt-1">{aiKazan}</div>
              {isAIThinking && (
                <div className="text-xs text-[#d4af37] mt-1 animate-pulse">Ойланып жатыр...</div>
              )}
            </div>
          </div>

          <div className="pointer-events-auto">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-10 h-10 rounded-full bg-black/40 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-black/60 transition-all"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* Action Area (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
           {selectedOtau !== null && !isAIThinking && !gameResult && !isAnimating && (
            <div className="pointer-events-auto flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-[#d4af37]/30 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="text-stone-300 text-sm">Отау {selectedOtau + 1} таңдалды</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePlayerMove(selectedOtau)}
                  className="px-8 py-3 bg-gradient-to-b from-[#d4af37] to-[#b89015] hover:to-[#a37f12] text-black font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  ЖҮРІС ЖАСАУ
                </button>
                <button
                  onClick={() => setSelectedOtau(null)}
                  className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm transition-all"
                >
                  Болдырмау
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar (Player Info) */}
        <div className="flex justify-between items-end">
          <div className={`px-5 py-3 rounded-xl backdrop-blur-md border ${isHumanTurn ? 'bg-[#1a0f08]/90 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-105 transform origin-bottom-left transition-all' : 'bg-black/40 border-stone-800'}`}>
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Сен</div>
            <div className="text-lg text-stone-200 font-medium">ШӘКІРТ</div>
            <div className="text-4xl text-[#d4af37] font-bold leading-none mt-1">{humanKazan}</div>
            {isHumanTurn && (
              <div className="text-xs text-[#d4af37] mt-1 animate-pulse">Сенің кезегің</div>
            )}
          </div>
        </div>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-black/80 backdrop-blur-lg border-l border-stone-800 p-4 pointer-events-auto flex flex-col z-40 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#d4af37] font-bold uppercase tracking-widest text-sm">Жүрістер</h3>
            <button onClick={() => setShowHistory(false)} className="text-stone-500 hover:text-stone-300"><ChevronDown size={20} className="-rotate-90" /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm pr-2 custom-scrollbar">
            {activeState.history.map((r: MoveRecord, i: number) => (
              <div key={i} className="flex flex-col py-2 border-b border-stone-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-stone-600 w-5 text-right text-xs">{r.moveNumber}.</span>
                  <span className={`font-medium ${r.player === session.humanPlayer ? 'text-stone-200' : 'text-stone-400'}`}>
                    {r.player === session.humanPlayer ? 'Сен' : 'AI'}
                  </span>
                  <span className="text-stone-400 ml-auto">Отау {r.otauIndex + 1}</span>
                </div>
                {(r.captured > 0 || r.tuzdykCreated) && (
                  <div className="flex gap-2 ml-7 mt-1">
                    {r.captured > 0 && <span className="text-green-500/80 text-xs">+{r.captured} қазанға</span>}
                    {r.tuzdykCreated && <span className="text-[#d4af37] text-xs">Тұздық!</span>}
                  </div>
                )}
              </div>
            ))}
            {activeState.history.length === 0 && (
              <div className="text-stone-600 text-center mt-10">Ойын басталған жоқ</div>
            )}
          </div>
        </div>
      )}

      {/* Result Screen Overlays everything */}
      {gameResult && (
        <div className="absolute inset-0 z-50 pointer-events-auto">
          <ResultScreen
            winner={gameResult.winner}
            isDraw={gameResult.isDraw}
            myPlayer={session.humanPlayer}
            playerKazan={humanKazan}
            aiKazan={aiKazan}
            moveCount={session.state.moveNumber - 1}
            capturedTotal={gameResult.totalCaptured}
            tuzdykCreated={gameResult.tuzdykCreated}
            duration={gameResult.duration}
            xp={gameResult.winner === session.humanPlayer ? 100 : gameResult.isDraw ? 50 : 20}
            isSubmitting={isSubmitting}
            onPlayAgain={handlePlayAgain}
            onShowReplay={() => {}} // Replay logic handled within history now
          />
        </div>
      )}
    </div>
  )
}
