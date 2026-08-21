import { test, expect } from '@playwright/test';

const urls = [
  '/',
  '/dashboard',
  '/profile',
  '/games',
  '/games/asyk-atu',
  '/games/kelin-shai',
  '/championship',
  '/map',
  '/ai-mentor',
  '/admin'
];

for (const url of urls) {
  test(`Check ${url}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    const response = await page.goto(`http://localhost:3000${url}`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    
    if (errors.length > 0) {
      console.log(`Errors on ${url}:`, errors);
    }
    // Check canvas count if it's a game page
    if (url === '/games/asyk-atu' || url === '/games/kelin-shai') {
      const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
      console.log(`Canvas count on ${url}: ${canvasCount}`);
      expect(canvasCount).toBeLessThanOrEqual(1);
    }
  });
}
