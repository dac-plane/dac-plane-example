import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    // The browser talks only to the application's own server, which holds the
    // dac-plane tokens; in development Vite forwards to it.
    proxy: { "/api": "http://127.0.0.1:3000", "/healthz": "http://127.0.0.1:3000" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
