export const fishingRodIds = [
  "OLD",
  "GOOD",
  "SUPER",
] as const

export type FishingRodId = typeof fishingRodIds[number]