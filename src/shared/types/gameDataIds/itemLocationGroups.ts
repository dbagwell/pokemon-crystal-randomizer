export const itemLocationGroupIds = [
  "REGULAR_ITEM_BALLS",
  "TM_ITEM_BALLS",
  "HIDDEN_ITEMS",
] as const

export type ItemLocationGroupId = typeof itemLocationGroupIds[number]