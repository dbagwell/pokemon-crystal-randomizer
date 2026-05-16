import type { ApplyPlayerOptionsResult, GenerateResult, PatchResult, WorkerParams } from "@shared/appData/workerTypes"
import path from "path"
import { Worker } from "worker_threads"

export const performJob = async <Params extends WorkerParams>(params: Params): Promise<
  Params extends { jobId: "generate" } ? GenerateResult
    : Params extends { jobId: "patch" } ? PatchResult
    : Params extends { jobId: "applyPlayerOptions" } ? ApplyPlayerOptionsResult
    : never
> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.js"), { workerData: params })
    worker.on("message", resolve)
    worker.on("error", reject)
    worker.on("exit", (code) => {
      if (code !== 0) { reject(new Error(`Worker stopped with exit code ${code}`)) }
    })
  })
}