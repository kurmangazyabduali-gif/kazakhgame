import { test, expect } from '@playwright/test'

test.describe('Kelin Shai Game', () => {
  test('should load the kelin shai page and show tutorial', async ({ page }) => {
    // Go directly to the page (assuming no auth block in test environment or mock is applied)
    await page.goto('/games/kelin-shai')
    
    // Wait for the tutorial overlay
    await expect(page.locator('text=Келін шай')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Правильно обслужить гостей')).toBeVisible()
    
    // Click 'Начать игру'
    await page.click('button:has-text("Начать игру")')
    
    // HUD should become visible
    await expect(page.locator('text=КЕЛІН ШАЙ').first()).toBeVisible()
    await expect(page.locator('text=Встреча')).toBeVisible() // Step 1 title
  })
})
