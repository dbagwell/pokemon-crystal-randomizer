export const starterLocationIds = [
  "LEFT",
  "MIDDLE",
  "RIGHT",
] as const

export type StarterLocationId = typeof starterLocationIds[number]