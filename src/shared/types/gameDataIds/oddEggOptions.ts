export const oddEggOptionIds = [
  "RANDOM",
  "SHINY_MATCH",
  "SAME",
] as const

export type OddEggOptionId = typeof oddEggOptionIds[number]