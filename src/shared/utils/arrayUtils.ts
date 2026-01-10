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

export const reduceArrayIntoRecord = <Element, ResultKey extends PropertyKey, ResultValue>(
  array: Element[],
  reduceFunction: (
    result: Partial<Record<ResultKey, ResultValue>>,
    element: Element,
    index: number,
  ) => void,
  result: Partial<Record<ResultKey, ResultValue>> = {},
): Record<ResultKey, ResultValue> => {
  array.forEach((element, index) => {
    reduceFunction(result, element, index)
  })
  
  return result as Record<ResultKey, ResultValue>
}

export const removeFirstElementFromArrayWhere = <Element>(array: Element[], condition: (element: Element) => boolean) => {
  array.splice(array.findIndex(condition), 1)
}

export const getAllCombinations = <Element>(sets: Element[][][]): Element[][] => {
  const filteredSets = sets.filter((set) => { return set.length > 0 })
  
  if (filteredSets.length === 0) {
    return []
  }
  
  const [firstSet, ...remainingSets] = filteredSets
  const subCombinations = getAllCombinations(remainingSets)
  const combinations = []
  
  if (subCombinations.length === 0) {
    return firstSet
  }

  for (const value of firstSet) {
    for (const subCombination of subCombinations) {
      combinations.push([...new Set([...value, ...subCombination])])
    }
  }

  return [...new Set(combinations)]
}

export const removeDuplicates = <Element>(array: Element[][]): Element[][] => {
  const stringifiedSets = array.map((subArray) => { return JSON.stringify(subArray.toSorted()) })
  return [...new Set(stringifiedSets)].map((string) => { return JSON.parse(string) })
}

export const removeSupersets = <Element>(array: Element[][]): Element[][] => {
  const uniques = removeDuplicates(array)
  const result: Element[][] = []

  for (let i = 0; i < uniques.length; i++) {
    let isSuperset = false
    for (let j = 0; j < uniques.length; j++) {
      if (i !== j && new Set(uniques[i]).isSupersetOf(new Set(uniques[j]))) {
        isSuperset = true
        break
      }
    }
    
    if (!isSuperset) {
      result.push(uniques[i])
    }
  }
  
  return result
}