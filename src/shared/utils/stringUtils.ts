export const isString = (value: any): value is string => {
  return typeof value === "string"
}

export const isSemanticVersion = (value: any): value is string => {
  if (!isString(value)) {
    return false
  }
  
  return !value.split(".").map((part) => {
    return parseInt(part)
  }).find((part) => {
    return Number.isNaN(part)
  })
}

export const isSemanticVersionLower = (version1: string, version2: string) => {
  const getVersionParts = (version: string) => {
    return version.split(".").map((part) => { return parseInt(part) })
  }
  
  const version1Parts = getVersionParts(version1)
  const version2Parts = getVersionParts(version2)
  
  let result = false
  
  for (let i = 0; i < version1Parts.length; i++) {
    if (version2Parts[i] === undefined || version1Parts[i] > version2Parts[i]) {
      break // version1 is higher
    } else if (version1Parts[i] < version2Parts[i]) {
      result = true
      break
    }
  }
  
  return result
}