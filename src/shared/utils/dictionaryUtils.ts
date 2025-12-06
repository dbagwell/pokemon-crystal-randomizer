export const reduceDictionaryInto = <Value>(
  object: object,
  initial: Dictionary<Value>,
  transform: (result: Dictionary<Value>, key: string, value: any) => void,
): Dictionary<Value> => {
  Object.entries(object).map(([key, value]) => {
    return transform(initial, key, value)
  })

  return initial
}