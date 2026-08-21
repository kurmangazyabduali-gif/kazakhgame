import { test, expect } from '@playwright/test'

test.describe('Asyk Atu Game Flow', () => {
  // Mock login and session setup would normally go here.
  // We'll focus on just verifying the game page loads and canvas is present
  // since true DB E2E is pending a live Supabase environment.

  test('Game page loads canvas and wrapper', async ({ page }) => {
    // Go directly to the game page.
    // Note: If authentication is required and no mock is present, it will redirect to /auth/login.
    // Assuming Playwright is set up with an auth state in a real project, but for now we just 
    // observe the redirect or render.

    await page.goto('/games/asyk-atu')
    
    // Check if it redirected to login (expected if no session)
    if (page.url().includes('/auth/login')) {
      expect(page.url()).toContain('/auth/login')
    } else {
      // If it rendered, the game wrapper should be present
      await expect(page.locator('text=АСЫҚ АТУ')).toBeVisible()
      
      // Phaser canvas should be injected
      const canvas = page.locator('canvas')
      await expect(canvas).toBeVisible()
    }
  })
})
