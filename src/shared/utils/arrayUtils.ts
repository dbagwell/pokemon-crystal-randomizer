import { isNullish } from "@utils"

export const compact = <Value>(array: (Value | nullish)[]): Value[] => {
  return array.filter((value) => { return !isNullish(value) }) as Value[]
}