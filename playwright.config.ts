import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test/ui',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
