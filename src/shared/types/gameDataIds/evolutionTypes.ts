export const evolutionTypeIds = [
  "LEVEL",
  "ITEM",
  "TRADE",
  "HAPPINESS",
  "STAT",
] as const

export type EvolutionTypeId = typeof evolutionTypeIds[number]