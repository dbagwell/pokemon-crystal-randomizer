export const itemLocationGroupIds = [
  "REGULAR_ITEM_BALLS",
  "TM_ITEM_BALLS",
  "HIDDEN_ITEMS",
  "HMS",
  "KEY_ITEMS",
  "MENU_ITEMS",
  "BADGES",
] as const

export type ItemLocationGroupId = typeof itemLocationGroupIds[number]