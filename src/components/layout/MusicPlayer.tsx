'use client'

import React, { useState, useEffect, useRef } from 'react'

/**
 * Web Audio Dombra Synthesizer.
 * Synthesizes an authentic Kazakh Dombra pentatonic melody on the fly
 * without needing external MP3 asset downloads!
 */
export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Traditional Dombra Pentatonic Scale Frequencies (A minor pentatonic: A3, C4, D4, E4, G4, A4)
  const notes = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25]

  const playDombraPluck = (freq: number, vol: number) => {
    if (!audioCtxRef.current) return

    try {
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // Dombra tone: triangle + sawtooth mix for bright wooden pluck
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      // Envelope: fast attack, pluck decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(vol * volume, ctx.currentTime + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.95)
    } catch (e) {
      // Audio context catch
    }
  }

  const startDombraRhythm = () => {
    if (typeof window === 'undefined') return

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }

    let noteIdx = 0
    const rhythmPattern = [0, 2, 3, 5, 3, 2, 4, 1]

    timerRef.current = setInterval(() => {
      const freq = notes[rhythmPattern[noteIdx % rhythmPattern.length]]
      const isAccent = noteIdx % 4 === 0
      playDombraPluck(freq, isAccent ? 0.5 : 0.25)
      noteIdx++
    }, 280) // ~107 BPM Dombra rhythm
  }

  const stopDombraRhythm = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopDombraRhythm()
      setIsPlaying(false)
    } else {
      startDombraRhythm()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    return () => {
      stopDombraRhythm()
    }
  }, [])

  return (
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-full px-3 py-1.5 text-white shadow-lg pointer-events-auto">
      {/* Play/Pause Toggle Button */}
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse'
            : 'bg-gray-800 text-amber-400 hover:bg-gray-700'
        }`}
        title={isPlaying ? 'Музыканы тоқтату' : 'Домбыра сазын қосу'}
      >
        {isPlaying ? '⏸' : '🪕'}
      </button>

      {/* Track Label */}
      <div className="hidden sm:block text-xs font-semibold text-amber-200 pr-1">
        {isPlaying ? <span className="text-yellow-400 animate-pulse">🪕 Күй тартылуда...</span> : 'Домбыра сазы'}
      </div>

      {/* Volume Slider */}
      {isPlaying && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 accent-amber-400 cursor-pointer"
          title="Дыбыс деңгейі"
        />
      )}
    </div>
  )
}
