/**
 * ULY DALA — 3D Asset Management & Memory Cleanup Utility
 * 
 * Defines standard pipelines for loading, falling back, and disposing 3D assets.
 */

type DisposableMaterial = {
  dispose: () => void
  map?: { dispose: () => void }
}

type DisposableResource = {
  dispose?: () => void
  geometry?: { dispose: () => void }
  material?: DisposableMaterial | DisposableMaterial[]
  children?: DisposableResource[]
  traverse?: (visitor: (resource: DisposableResource) => void) => void
}

type DisposableRenderer = {
  dispose: () => void
  forceContextLoss: () => void
  domElement: { remove: () => void }
}

/**
 * Cleanup guidelines for WebGL/Three.js resources to prevent memory leaks,
 * especially crucial during Showcase iframe transitions.
 */
export function disposeThreeResource(resource: DisposableResource | null | undefined) {
  if (!resource) return

  // Dispose Geometries
  if (resource.geometry) {
    resource.geometry.dispose()
  }

  // Dispose Materials
  if (resource.material) {
    if (Array.isArray(resource.material)) {
      resource.material.forEach((mat) => {
        mat.map?.dispose()
        mat.dispose()
      })
    } else {
      resource.material.map?.dispose()
      resource.material.dispose()
    }
  }

  // Traverse children and dispose
  if (resource.children) {
    resource.children.forEach(disposeThreeResource)
  }
}

/**
 * Safely dispose the entire scene and renderer.
 */
export function cleanupGameScene(scene: DisposableResource | null | undefined, renderer: DisposableRenderer | null | undefined) {
  if (scene?.traverse) {
    scene.traverse(disposeThreeResource)
  } else if (scene) {
    disposeThreeResource(scene)
  }
  
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
}

/**
 * Mock Asset Loader for graceful fallback.
 * If a real GLB is missing or fails to load, returns the existing procedural geometry
 * without throwing raw UI errors.
 */
export async function loadCulturalAsset<TAsset>(assetPath: string, fallbackFactory: () => TAsset): Promise<TAsset | 'LOADED_GLB_MOCK'> {
  try {
    // In production, this would use GLTFLoader.
    // For Phase 13, since assets are PENDING, we simulate a failure or return fallback.
    const isMock = assetPath.includes('mock')
    
    if (isMock) {
      console.log(`[AssetManager] using fallback geometry for ${assetPath}`)
      return fallbackFactory()
    }

    // Pseudo-fetch
    const response = await fetch(assetPath)
    if (!response.ok) throw new Error('GLB Load failed')
    
    // Return loaded asset
    return 'LOADED_GLB_MOCK'
  } catch {
    console.warn(`[AssetManager] Failed to load ${assetPath}. Reverting to fallback geometry.`)
    return fallbackFactory()
  }
}
