import { isNumber } from "@shared/utils"

export class DataFormat {
  
  values: (number | string)[]
  referenceOffsets: Dictionary<number>
  
  constructor(values: (number | string)[] = [], referenceOffsets: Dictionary<number> = {}) {
    this.values = values
    this.referenceOffsets = referenceOffsets
  }
  
  readonly add = (dataFormat: DataFormat) => {
    this.values.push(...dataFormat.values)
    this.referenceOffsets = { ...dataFormat.referenceOffsets, ...this.referenceOffsets }
  }
  
  readonly size = (): number => {
    return this.values.reduce(
      (result: number, value) => {
        if (isNumber(value)) {
          return result + 1
        } else {
          return result + 2
        }
      },
      0,
    )
  }
  
  readonly toString = (): string => {
    return this.values.map((value) => { return value.toString(16).padStart(2, "0") }).join(" ").toUpperCase()
  }
  
}