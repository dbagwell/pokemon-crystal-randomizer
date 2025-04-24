import type { RendererAPI } from "@rendererAPI"
import crypto from "crypto"
import type { BrowserWindow } from "electron"
import { bindWindowApi, type WindowApiBinding } from "electron-affinity/main"

type RendererAPIDictionary<Key extends number | "mainWindow"> = { [K in Key]?: WindowApiBinding<RendererAPI> }

export const rendererAPIS: RendererAPIDictionary<number | "mainWindow"> = {}
export const rendererAPIResponseListeners: Dictionary<(result: any) => void> = {}

export const bindRendererAPI = async (window: BrowserWindow, isMainWindow?: boolean) => {
  rendererAPIS[isMainWindow ? "mainWindow" : window.id] = await bindWindowApi<RendererAPI>(window, "RendererAPI")
}

export const makeRendererAPIRequest = async <Result>(
  request: (requestId: string) => void,
  resultListener: (
    result: any,
    resolve: (value: Result | PromiseLike<Result>) => void,
    reject: (reason?: any) => void,
  ) => void
): Promise<Result> => {
  return await new Promise<Result>((resolve, reject) => {
    const requestId = crypto.randomUUID()
    
    rendererAPIResponseListeners[requestId] = (result: any) => {
      resultListener(result, resolve, reject)
      delete rendererAPIResponseListeners[requestId]
    }
    
    request(requestId)
  })
}