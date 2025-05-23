const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
    // browserName is required but no actual browser will launch for API tests
    browserName: 'chromium',
  },

  projects: [
    {
      name: 'API Tests',
      // If you want to override project-level settings here, do it
      // but it's enough to keep it only in `use`
    },
  ],

  // Optional local server start config, uncomment if needed
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
