import type { WorkerParams } from "@shared/appData/workerTypes"
import { applyPlayerOptions, generate } from "@worker/generator"
import { patch } from "@worker/patcher"
import { parentPort, workerData } from "worker_threads"

const performJob = (params: WorkerParams) => {
  switch (params.jobId) {
  case "generate": return generate(params.jobParams)
  case "patch": return patch(params.jobParams)
  case "applyPlayerOptions": return {
    rom: params.jobParams.rom,
    namesLog: applyPlayerOptions(params.jobParams),
  }
  default: {
    const unhandledCase: never = params
    throw new Error(`Unhandled case: ${unhandledCase}`)
  }
  }
}

parentPort?.postMessage(performJob(workerData))