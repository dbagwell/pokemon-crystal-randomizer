export const mapObjectTypeIds = [
  "SCRIPT",
  "ITEMBALL",
  "TRAINER",
] as const

export type MapObjectTypeId = typeof mapObjectTypeIds[number]