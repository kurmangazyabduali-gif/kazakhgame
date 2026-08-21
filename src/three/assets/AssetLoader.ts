import { useGLTF } from '@react-three/drei'

// This creates a typed preload and caching mechanism
export class ModelCache {
  static preload(path: string) {
    useGLTF.preload(path)
  }

  static clearCache(path: string | string[]) {
    useGLTF.clear(path)
  }
}

// Hook wrapper for easy asset loading
export function useAsset(path: string) {
  const gltf = useGLTF(path)
  return gltf
}
