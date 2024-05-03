import { isNullish } from "@utils"

export const compact = <Value>(array: (Value | nullish)[]): Value[] => {
  return array.filter((value) => { return !isNullish(value) }) as Value[]
}

export const mapToRecord = <Key extends string, Value>(keys: readonly Key[], valueForKey: (key: Key) => Value): Record<Key, Value> => {
  return keys.reduce((result: Partial<Record<Key, Value>>, key) => {
    return {
      ...result,
      [key]: valueForKey(key),
    }
  }, {}) as Record<Key, Value>
}