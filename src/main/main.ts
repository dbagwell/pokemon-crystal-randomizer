import "source-map-support/register"

import { handlePCRPFile as processPCRPFile } from "@lib/generator/pcrpProcessor"
import { MainAPI } from "@lib/ipc/mainAPI"
import { bindRendererAPI } from "@lib/ipc/rendererAPIUtils"
import { compact, isNotNullish } from "@shared/utils"
import { app, BrowserWindow, dialog, Menu, type MenuItemConstructorOptions, nativeTheme } from "electron"
import { exposeMainApi } from "electron-affinity/main"
import squirrel from "electron-squirrel-startup"
import path from "path"

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

let ready = false
let quitAfterGenerating = false
let filePathToOpen: string | undefined

if (squirrel) {
  app.quit()
}

app.on("window-all-closed", () => {
  app.quit()
})

const createWindow = async () => {
  const mainAPI = new MainAPI()
  exposeMainApi(mainAPI)
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preloadMainWindow.js"),
      devTools: import.meta.env.DEV,
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#000000" : "#FFFFFF",
    icon: path.join(__dirname, "icons/icon.png"),
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/mainWindow.html`)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/mainWindow.html`))
  }

  mainWindow.once("ready-to-show", async () => {
    mainWindow.show()
    bindRendererAPI(mainWindow, "mainWindow")
  })
}

const handlePCRPFile = async (filePath: string) => {
  try {
    await processPCRPFile(filePath)
  } catch (error: any) {
    dialog.showErrorBox(
      "Error",
      error.message,
    )
  }
}

app.on("ready", async () => {
  ready = true
  
  if (!quitAfterGenerating) {
    if (!import.meta.env.DEV && isNotNullish(process.argv[1])) {
      await handlePCRPFile(process.argv[1])
      app.quit()
    } else {
      await createWindow()
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
    createWindow()
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
      isMac ? undefined : { role: "quit" },
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