import { create } from 'zustand'
import type { ThreeEvent } from '@react-three/fiber'

interface InteractionState {
  hoveredObject: string | null
  selectedObject: string | null
  setHovered: (id: string | null) => void
  setSelected: (id: string | null) => void
  clear: () => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
  hoveredObject: null,
  selectedObject: null,
  setHovered: (id) => set({ hoveredObject: id }),
  setSelected: (id) => set({ selectedObject: id }),
  clear: () => set({ hoveredObject: null, selectedObject: null })
}))

// Custom hook to easily attach interaction events to a mesh
export function useInteractable(id: string) {
  const setHovered = useInteractionStore(s => s.setHovered)
  const setSelected = useInteractionStore(s => s.setSelected)
  
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setHovered(id)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setHovered(null)
      document.body.style.cursor = 'auto'
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      setSelected(id)
    }
  }
}
