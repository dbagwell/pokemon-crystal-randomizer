export const windowTypes = [
  "GENERATOR",
  "PLAYER_OPTIONS",
  "RELEASE_NOTES",
] as const

export type WindowType = typeof windowTypes[number]