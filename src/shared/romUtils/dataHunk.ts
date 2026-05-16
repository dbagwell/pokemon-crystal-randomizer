import type { DataFormat } from "@shared/romUtils/dataFormat"
import { bytesFrom, isNullish, isNumber } from "@shared/utils"

export type DataHunk = {
  readonly offset: number
  readonly values: number[]
}

export const dataHunkFrom = (offset: number, dataFormat: DataFormat, referenceAddresses: Dictionary<number>) => {
  return {
    offset: offset,
    values: dataFormat.values.flatMap((value) => {
      if (isNumber(value)) {
        return value
      } else { // isString(value)
        if (isNullish(referenceAddresses[value])) {
          throw new Error(`Cannot find data reference with path '${value}'.`)
        }
          
        return bytesFrom(referenceAddresses[value], 2)
      }
    }),
  }
}