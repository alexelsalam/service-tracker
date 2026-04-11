import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // coverage: {
    //   reporter: ["text", "html"],
    // },
    include: ["*_test.ts"],
    // exclude: [
    //   "**/node_modules/**",
    //   "**/.git/**",
    //   "**/dist/**",
    //   "**/coverage/**",
    //   "**/src/**/*.spec.ts**",
    // ],
  },
});
