export const playerSpriteIds = [
  "BOY",
  "GIRL",
] as const

export type PlayerSpriteId = typeof playerSpriteIds[number]