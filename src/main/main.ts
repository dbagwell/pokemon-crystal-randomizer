import "source-map-support/register"

import { generateFromCLI } from "@lib/generator/cli"
import { handlePCRPFile as processPCRPFile } from "@lib/generator/pcrpProcessor"
import { MainAPI } from "@lib/ipc/mainAPI"
import { makeRendererAPIRequest, rendererAPIS } from "@lib/ipc/rendererAPIUtils"
import { getPreference, ignoreUpdateVersion, setPreference } from "@lib/userData/preferences"
import { debounce } from "@lib/utils/commonUtils"
import { forceCloseWindow, showWindow } from "@lib/utils/windowManager"
import { compact, isNotNullish } from "@shared/utils"
import { app, BrowserWindow, dialog, Menu, type MenuItemConstructorOptions } from "electron"
import { exposeMainApi } from "electron-affinity/main"
import { autoUpdater } from "electron-updater"

let ready = false
let quitAfterGenerating = false
let filePathToOpen: string | undefined
let isProcessingPCRP = false

app.on("window-all-closed", () => {
  if (!isProcessingPCRP) {
    app.quit()
  }
})

const showGeneratorWindow = async () => {
  const windowSize = getPreference("generatorWindowSize")
  
  const window = await showWindow({
    windowType: "GENERATOR",
    position: getPreference("generatorWindowPosition"),
    width: windowSize[0],
    height: windowSize[1],
  })
  
  checkForUpdates()
  
  window.on("resized", () => {
    const size = window.getSize()
    setPreference("generatorWindowSize", [size[0], size[1]])
  })
  
  const saveWindowPoistion = debounce(() => {
    const position = window.getPosition()
    setPreference("generatorWindowPosition", [position[0], position[1]])
  }, 500)
  
  window.on("moved", () => {
    saveWindowPoistion()
  })
  
  window.once("closed", () => {
    window.removeAllListeners()
  })
}

const checkForUpdates = async () => {
  autoUpdater.autoInstallOnAppQuit = false
  autoUpdater.autoDownload = false
  const updateInfo = await autoUpdater.checkForUpdates()
  
  if (isNotNullish(updateInfo) && updateInfo.isUpdateAvailable && !getPreference("ignoredUpdateVersions").includes(updateInfo.updateInfo.version)) {
    showWindow({
      windowType: "RELEASE_NOTES",
      width: 800,
      height: 700,
      afterBind: async (window) => {
        const selectedAction = await makeRendererAPIRequest(
          (requestId: string) => {
            rendererAPIS[window.id]?.setReleaseNotes({
              requestId: requestId,
              releaseNotes: updateInfo.updateInfo.releaseNotes as string,
              currentVersionNumber: app.getVersion(),
              newVersionNumber: updateInfo.updateInfo.version,
            })
          },
          (selectedAction, resolve, reject) => {
            if (selectedAction === "UPDATE" || selectedAction === "IGNORE" || selectedAction === "SKIP") {
              resolve(selectedAction)
            } else {
              reject(new Error(`Received invalid action from release notes. Expected one of 'UPDATE', 'IGNORE', or 'SKIP' but got '${selectedAction}'.`))
            }
          },
        )
    
        if (selectedAction === "UPDATE") {
          try {
            autoUpdater.autoRunAppAfterInstall = true
            await autoUpdater.downloadUpdate()
            autoUpdater.quitAndInstall()
          } catch (error: any) {
            dialog.showErrorBox(
              "Error",
              error.message,
            )
          }
        } else {
          if (selectedAction === "SKIP") {
            ignoreUpdateVersion(updateInfo.updateInfo.version)
          }
        
          forceCloseWindow(window)
        }
      },
    })
  }
}

const handlePCRPFile = async (filePath: string) => {
  try {
    isProcessingPCRP = true
    await processPCRPFile(filePath)
  } catch (error: any) {
    dialog.showErrorBox(
      "Error",
      error.message,
    )
  } finally {
    isProcessingPCRP = false
  }
}

app.on("ready", async () => {
  ready = true
  
  const mainAPI = new MainAPI()
  exposeMainApi(mainAPI)
  
  if (!quitAfterGenerating) {
    if (process.argv[import.meta.env.DEV ? 2 : 1] === "generate") {
      await generateFromCLI(process.argv)
      app.quit()
    } else if (isNotNullish(process.argv[1]) && process.argv[1].endsWith(".pcrp")) {
      await handlePCRPFile(process.argv[1])
      app.quit()
    } else {
      await showGeneratorWindow()
    }
  }
  
  if (isNotNullish(filePathToOpen)) {
    await handlePCRPFile(filePathToOpen)
    filePathToOpen = undefined
    
    if (quitAfterGenerating) {
      app.quit()
    }
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0 && !quitAfterGenerating) {
    showGeneratorWindow()
  }
})

app.on("open-file", async (_, path) => {
  quitAfterGenerating = !ready
  
  if (ready) {
    await handlePCRPFile(path)
  } else {
    filePathToOpen = path
  }
})

const isMac = process.platform === "darwin"
app.applicationMenu = Menu.buildFromTemplate(compact([
  isMac ? {
    label: app.name,
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  } : undefined,
  {
    label: "File",
    submenu: compact([
      {
        label: "Apply Patch",
        click: async () => {
          const filePath = dialog.showOpenDialogSync({
            filters: [
              {
                name: "Pokémon Crystal Randomizer Patch",
                extensions: [
                  "pcrp",
                ],
              },
              {
                name: "Binary Patch System File",
                extensions: [
                  "bps",
                ],
              },
            ],
            buttonLabel: "Apply Patch",
          })
          
          if (isNotNullish(filePath)) {
            await handlePCRPFile(filePath[0])
          }
        },
      },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" },
    ]),
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" },
    ],
  },
  {
    label: "View",
    submenu: [
      ...import.meta.env.DEV ? [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
      ] as MenuItemConstructorOptions[] : [],
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...isMac ? [
        { type: "separator" },
        { role: "front" },
        { type: "separator" },
        { role: "window" },
      ] as MenuItemConstructorOptions[] : [],
    ],
  },
]))