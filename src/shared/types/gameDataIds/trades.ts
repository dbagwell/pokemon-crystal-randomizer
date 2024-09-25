export const tradeIds = [
  "MIKE",
  "KYLE",
  "TIM",
  "EMY",
  "CHRIS",
  "KIM",
  "FOREST",
] as const

export type TradeId = typeof tradeIds[number]