export const additionalOptionIds = [
  "INSTANT_TEXT",
  "HOLD_TO_MASH",
  "NICKNAMES",
  "RIDE_MUSIC",
] as const

export type AdditionalOptionId = typeof additionalOptionIds[number]