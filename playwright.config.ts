import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "src/main/frontend/e2e",
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "./gradlew bootRun --args='--vaadin.launch-browser=false'",
    url: "http://localhost:8080",
    timeout: 120_000,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
