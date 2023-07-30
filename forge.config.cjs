const fs = require("fs")
const path = require("path")

module.exports = {
  packagerConfig: {
    ignore: [
      "(?!^/package\\.json$|^/\\.vite$|^/\\.vite/.*$)^.+$",
    ],
    icon: "src/main/resources/icons/icon",
  },
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux", "win32", "mas"],
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main/main.ts",
            config: "vite.main.config.mjs",
          },
          {
            entry: "src/preload/preloadMainWindow.ts",
            config: "vite.preload.config.mjs",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.mjs",
          },
        ],
      },
    },
  ],
  hooks: {
    postPackage: async (_, packageResult) => {
      const productName = JSON.parse(fs.readFileSync("package.json")).productName
      const resourcesPaths = [
        `${productName}.app/Contents/Resources`,
        "resources",
      ]
      packageResult.outputPaths.forEach((outputPath) => {
        resourcesPaths.forEach((resourcesPath) => {
          try {
            const filePath = path.resolve(outputPath, resourcesPath, "app/package.json")
            const json = JSON.parse(fs.readFileSync(filePath))
            fs.writeFileSync(filePath, JSON.stringify({
              name: json.name,
              productName: json.productName,
              description: json.description,
              version: json.version,
              author: json.author,
              license: json.license,
              main: json.main,
            }, null, 2))
          } catch {
            return
          }
        })
      })
    },
  },
}