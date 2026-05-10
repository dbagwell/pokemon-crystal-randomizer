import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte"

import viteCommonConfig from "./vite.common.config.mjs"

export default viteCommonConfig({
  root: "src/renderer",
  outdir: "../../.vite/renderer",
  rolldownOptions: {
    input: {
      mainWindow: "src/renderer/window.html",
    },
    output: {
      keepNames: true, // This is required for electron-affinity ipc to work.
    },
  },
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      configFile: false,
    }),
  ],
})