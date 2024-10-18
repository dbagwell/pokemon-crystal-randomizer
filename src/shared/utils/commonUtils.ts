export const isNullish = <Value>(value: Value | nullish): value is nullish => {
  return value === undefined || value === null
}

export const isNotNullish = <Value>(value: Value | nullish): value is Value => {
  return !isNullish(value)
}

export const isObject = <Value>(value: Value | nullish): value is Value => {
  return typeof value === "object" && isNotNullish(value)
}