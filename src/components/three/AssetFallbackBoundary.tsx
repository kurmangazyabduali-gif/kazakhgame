import React, { Component, ReactNode, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { disposeThreeResource } from '@/lib/utils/assetManager'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class FallbackErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[AssetManager] Failed to load production asset. Reverting to fallback geometry.', error.message, errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

interface AssetLoaderProps {
  url: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function GLTFModel({ url, scale, position, rotation }: AssetLoaderProps) {
  const { scene } = useGLTF(url)
  
  // Basic memory cleanup on unmount for loaded models
  React.useEffect(() => {
    return () => {
      if (scene) {
        disposeThreeResource(scene)
      }
    }
  }, [scene])

  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />
}

interface AssetFallbackBoundaryProps {
  assetId: string
  url: string
  fallback: ReactNode
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * AssetFallbackBoundary
 * 
 * Attempts to load a production 3D asset (GLB).
 * If the asset is missing (e.g. pending state) or fails to load,
 * it catches the error and silently renders the fallback mock geometry.
 */
export function AssetFallbackBoundary({ url, fallback, scale, position, rotation }: AssetFallbackBoundaryProps) {
  // If the asset is explicitly marked as mock or missing, we can just skip loading
  if (!url || url.includes('mock')) {
    return <>{fallback}</>
  }

  return (
    <FallbackErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <GLTFModel url={url} scale={scale} position={position} rotation={rotation} />
      </Suspense>
    </FallbackErrorBoundary>
  )
}
