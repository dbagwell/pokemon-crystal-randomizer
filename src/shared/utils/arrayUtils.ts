import { isNullish } from "@utils"

export const compact = <Value>(array: (Value | undefined)[]): Value[] => {
  return array.filter((value) => { return !isNullish(value) }) as Value[]
}