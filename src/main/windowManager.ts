import { bindRendererAPI } from "@lib/ipc/rendererAPIUtils"
import type { WindowType } from "@shared/appData/windowTypes"
import { BrowserWindow, nativeTheme } from "electron"
import path from "path"

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

export const showWindow = async (params: {
  windowType: WindowType
  position?: [number, number]
  width: number
  height: number
}) => {
  const {
    windowType,
    position,
    width,
    height,
  } = params
  
  const window = new BrowserWindow({
    x: position?.[0],
    y: position?.[1],
    width: width,
    height: height,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preloadWindow.js"),
      devTools: import.meta.env.DEV,
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#000000" : "#FFFFFF",
    icon: path.join(__dirname, "icons/icon.png"),
  })
  
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/window.html?windowType=${windowType}`)
  } else {
    window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/window.html`), {
      query: {
        windowType: windowType,
      },
    })
  }
  
  window.once("ready-to-show", async () => {
    window.show()
    bindRendererAPI(window, windowType === "GENERATOR")
  })
  
  return new Promise<BrowserWindow>((resolve) => {
    window.once("show", async () => {
      resolve(window)
    })
  })
}