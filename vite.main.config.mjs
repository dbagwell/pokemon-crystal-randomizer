import viteCommonConfig from "./vite.common.config.mjs"

export default viteCommonConfig({
  publicDir: "src/resources",
  copyPublicDir: true,
  rolldownOptions: {
    output: {
      keepNames: true, // This is required for electron-affinity ipc to work.
    },
  },
})