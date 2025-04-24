export const windowTypes = [
  "GENERATOR",
  "PLAYER_OPTIONS",
] as const

export type WindowType = typeof windowTypes[number]