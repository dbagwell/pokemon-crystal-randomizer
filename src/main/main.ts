import { MainAPI } from "@lib/ipc/mainAPI"
import { bindRendererAPI } from "@lib/ipc/rendererAPIUtils"
import { app, BrowserWindow, Menu, type MenuItemConstructorOptions, nativeTheme } from "electron"
import { exposeMainApi } from "electron-affinity/main"
import squirrel from "electron-squirrel-startup"
import path from "path"

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

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

app.on("ready", createWindow)

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const isMac = process.platform === "darwin"
app.applicationMenu = Menu.buildFromTemplate([
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
  } : {
    label: "File",
    submenu: [
      { role: "quit" },
    ],
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
])