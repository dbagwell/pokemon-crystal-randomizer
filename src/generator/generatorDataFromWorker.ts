import { computeGeneratorData, computePlayerSpecificPatches } from "@lib/generator"
import type { GeneratorMethod } from "@mainShared/generatorUtils"
import { parentPort, workerData } from "worker_threads"

const method = workerData.method as GeneratorMethod
const params = workerData.params
let result: any

switch (method) {
case "generatorDataFrom": {
  result = computeGeneratorData(params as Parameters<typeof computeGeneratorData>[0])
  break
}
case "applyPlayerOptionsToROM": {
  result = computePlayerSpecificPatches(params as Parameters<typeof computePlayerSpecificPatches>[0])
  break
}
default: {
  const unhandledCase: never = method
  throw new Error(`Unhandled case: ${unhandledCase}`)
}
}

parentPort?.postMessage(result)