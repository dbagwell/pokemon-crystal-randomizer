import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default ({ root, publicDir, rollupOptions, plugins }) => {
  const pluginsArray = plugins ? plugins : []
  return defineConfig(({ mode }) => {
    const isDev = mode === "development"
    return {
      root: root,
      publicDir: publicDir,
      build: {
        rollupOptions: rollupOptions,
        sourcemap: isDev,
        minify: !isDev,
      },
      esbuild: {
        keepNames: true, // This is required for electron-affinity ipc to work.
      },
      plugins: [
        tsconfigPaths(),
        ...pluginsArray,
      ],
    }
  })
}