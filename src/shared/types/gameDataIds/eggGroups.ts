export const eggGroupIds = [
  "MONSTER",
  "WATER_1",
  "BUG",
  "FLYING",
  "GROUND",
  "FAIRY",
  "PLANT",
  "HUMANSHAPE",
  "WATER_3",
  "MINERAL",
  "INDETERMINATE",
  "WATER_2",
  "DITTO",
  "DRAGON",
] as const

export type EggGroupId = typeof eggGroupIds[number]