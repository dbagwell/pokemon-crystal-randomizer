import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte"

import viteCommonConfig from "./vite.common.config.mjs"

export default viteCommonConfig({
  root: "src/renderer",
  rollupOptions: {
    input: {
      mainWindow: "src/renderer/mainWindow.html",
    },
  },
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: {
        accessors: true,
      },
    }),
  ],
})