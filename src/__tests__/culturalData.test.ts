import { CLAIMS, SOURCES, validateCulturalClaims } from '../lib/data/culturalSources'
import { GLOSSARY } from '../lib/data/culturalGlossary'
import { REGIONS } from '../lib/data/regions'

describe('Cultural Authenticity Data Validation', () => {
  
  it('should pass strict claim validation (validateCulturalClaims)', () => {
    expect(() => validateCulturalClaims(CLAIMS, SOURCES)).not.toThrow()
  })

  it('Verified claims must have at least one valid source', () => {
    CLAIMS.forEach(claim => {
      if (claim.verified) {
        expect(claim.sourceIds.length).toBeGreaterThan(0)
        claim.sourceIds.forEach(id => {
          expect(SOURCES[id]).toBeDefined()
        })
      }
    })
  })

  it('Kelin Shai is strictly NOT a sport', () => {
    const kelinClaims = CLAIMS.filter(c => c.gameSlug === 'kelin-shai')
    kelinClaims.forEach(claim => {
      expect(claim.category).not.toBe('modern_sport')
      expect(claim.category).not.toBe('rules')
    })
  })

  it('Glossary terms have valid sources', () => {
    GLOSSARY.forEach(term => {
      expect(term.sourceIds.length).toBeGreaterThan(0)
      term.sourceIds.forEach(id => {
        expect(SOURCES[id]).toBeDefined()
      })
    })
  })

  it('Map region relations require verification and sources', () => {
    Object.values(REGIONS).forEach(region => {
      if (region.verified) {
        expect(region.sourceIds).toBeDefined()
        expect(region.sourceIds.length).toBeGreaterThan(0)
      }
    })
  })
})
