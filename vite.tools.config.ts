import { defineConfig } from "vite"

export default defineConfig(() => {
  return {
    resolve: {
      tsconfigPaths: true,
    },
  }
})