import { ASSETS, validateAssetManifest } from '../lib/data/assets'
import { SOURCES } from '../lib/data/culturalSources'

describe('Visual Authenticity & Asset Manifest', () => {
  
  it('should pass manifest validation without strict license checking (Pending State)', () => {
    // Currently, we don't enforce strict licensing because assets are in 'mock' state.
    expect(() => validateAssetManifest(ASSETS, false)).not.toThrow()
  })

  it('should fail strict license validation if any asset has unknown license', () => {
    // This test ensures that when we flip the switch to production, 
    // unknown licenses will block the build.
    expect(() => validateAssetManifest(ASSETS, true)).toThrow('Asset Validation Failed')
  })

  it('every asset must have at least one cultural reference source', () => {
    ASSETS.forEach(asset => {
      expect(asset.referenceSourceIds.length).toBeGreaterThan(0)
      asset.referenceSourceIds.forEach(id => {
        expect(SOURCES[id]).toBeDefined()
      })
    })
  })

  it('primary games must have a hero asset', () => {
    const games = ['kusbegilik', 'jamby-atu', 'togyzqumalak', 'asyk-atu', 'kelin-shai']
    
    games.forEach(slug => {
      const heroAssets = ASSETS.filter(a => a.gameSlug === slug && a.type === 'hero')
      expect(heroAssets.length).toBeGreaterThan(0)
    })
  })
})

import { disposeThreeResource } from '../lib/utils/assetManager'
import { vi } from 'vitest'

describe('Asset Memory Cleanup', () => {
  it('disposeThreeResource safely handles mock Three objects', () => {
    const mockGeometry = { dispose: vi.fn() }
    const mockMaterial = { dispose: vi.fn(), map: { dispose: vi.fn() } }
    
    const mockResource = {
      geometry: mockGeometry,
      material: mockMaterial,
      children: []
    }
    
    expect(() => disposeThreeResource(mockResource)).not.toThrow()
    expect(mockGeometry.dispose).toHaveBeenCalled()
    expect(mockMaterial.dispose).toHaveBeenCalled()
    expect(mockMaterial.map.dispose).toHaveBeenCalled()
  })
})
