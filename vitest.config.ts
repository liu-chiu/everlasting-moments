import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// jsdom's Blob lacks arrayBuffer()/text(); patch it via Node's Blob before tests run.
import { installJsdomBlobFix } from "./src/test/jsdom-blob-fix";

installJsdomBlobFix();

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
