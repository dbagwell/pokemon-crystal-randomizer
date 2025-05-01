import "source-map-support/register"

import { handlePCRPFile as processPCRPFile } from "@lib/generator/pcrpProcessor"
import { MainAPI } from "@lib/ipc/mainAPI"
import { getPreference, ignoreUpdateVersion } from "@lib/userData/preferences"
import { compact, isNotNullish } from "@shared/utils"
import { app, BrowserWindow, dialog, Menu, type MenuItemConstructorOptions } from "electron"
import { exposeMainApi } from "electron-affinity/main"
import { autoUpdater } from "electron-updater"

import { showWindow } from "./windowManager"

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
  showWindow({
    windowType: "GENERATOR",
    width: 800,
    height: 600,
  })
  
  checkForUpdates()
}

const checkForUpdates = async () => {
  autoUpdater.autoInstallOnAppQuit = false
  autoUpdater.autoDownload = false
  const updateInfo = await autoUpdater.checkForUpdates()
  
  if (isNotNullish(updateInfo) && updateInfo.isUpdateAvailable && !getPreference("ignoredUpdateVersions").includes(updateInfo.updateInfo.version)) {
    const result = dialog.showMessageBoxSync({
      message: `A newer version of Pokémon Crystal Randomizer is available.\n\nWould you like to update to version ${updateInfo.updateInfo.version}?`,
      buttons: [
        "Update and Restart",
        "Ask Again Later",
        "Skip Update",
      ],
    })
    
    if (result === 0) {
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
    } else if (result === 2) {
      ignoreUpdateVersion(updateInfo.updateInfo.version)
    }
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
    if (!import.meta.env.DEV && isNotNullish(process.argv[1])) {
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