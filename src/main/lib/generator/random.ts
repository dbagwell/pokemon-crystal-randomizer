import { isNullish } from "@shared/utils"
import seedrandom from "seedrandom"

export class Random {
  
  constructor(seed: string) {
    const rng = seedrandom(seed)
    this.int = (min: number, max: number): number => {
      return Math.floor(rng() * (max + 1 - min)) + min
    }
    
    this.intFromNormalDistribution = (min: number, max: number): number => {
      const sample1 = rng()
      const sample2 = rng()
      const transformed = Math.sqrt(-2 * Math.log(sample1)) * Math.cos(2 * Math.PI * sample2) * 0.3413447460685429 + 0.5
      return Math.floor(transformed * (max + 1 - min)) + min
    }
  }
  
  readonly int: (min: number, max: number) => number
  readonly intFromNormalDistribution: (min: number, max: number) => number
  
  readonly boolean = (): boolean => {
    return this.int(0, 1) === 1
  }
  
  readonly element = <Element>(
    params: {
      array: Element[]
      errorInfo?: {
        elementName: string
        mainSettingName: string
        conflictingSettings: string[]
      } | undefined
      remove?: boolean
      allowUndefined?: boolean
    }
  ): Element => {
    const index = this.int(0, params.array.length - 1)
    const element = params.array[index]
    
    if (!params.allowUndefined && isNullish(element)) {
      if (isNullish(params.errorInfo)) {
        // If we didn't find a random element but we haven't passed in info for the error, we're using this wrong
        throw new Error("Attempted to get random element from empty array.")
      } else {
        const settingsText = params.errorInfo.conflictingSettings.reduce((result, setting) => {
          return result + `\n - ${setting}`
        }, "")
        
        throw new Error(`Failed to select a random ${params.errorInfo.elementName} while processing the '${params.errorInfo.mainSettingName}' setting due to a possible conflict with the following settings:${settingsText}`)
      }
    }
    
    if (params.array.length > 0 && params.remove) {
      params.array.splice(index, 1)
    }
    
    return element
  }
  
}