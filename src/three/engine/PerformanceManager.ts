import { create } from 'zustand'

interface PerformanceState {
  fps: number
  drawCalls: number
  triangles: number
  memory: number
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA'
  setMetrics: (metrics: Partial<PerformanceState>) => void
  setQuality: (quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA') => void
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  fps: 60,
  drawCalls: 0,
  triangles: 0,
  memory: 0,
  quality: 'HIGH',
  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
  setQuality: (quality) => set({ quality })
}))
