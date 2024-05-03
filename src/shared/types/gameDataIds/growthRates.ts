export const growthRateIds = [
  "FAST",
  "MEDIUM_FAST",
  "MEDIUM_SLOW",
  "SLOW",
] as const

export type GrowthRateId = typeof growthRateIds[number]