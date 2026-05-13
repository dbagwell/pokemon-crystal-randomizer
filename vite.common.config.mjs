import { defineConfig } from "vite"

export default ({ root, outdir, publicDir, copyPublicDir, rolldownOptions, plugins }) => {
  const pluginsArray = plugins ? plugins : []
  return defineConfig(({ mode }) => {
    const isDev = mode === "development"
    return {
      root: root,
      publicDir: publicDir,
      build: {
        outDir: outdir,
        emptyOutDir: false,
        copyPublicDir: copyPublicDir ?? false,
        rolldownOptions: rolldownOptions,
        sourcemap: isDev,
        minify: !isDev,
      },
      resolve: {
        tsconfigPaths: true,
      },
      plugins: [
        ...pluginsArray,
      ],
    }
  })
}