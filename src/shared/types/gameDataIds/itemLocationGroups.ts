export const itemLocationGroupIds = [
  "REGULAR_ITEM_BALLS",
  "TM_ITEM_BALLS",
  "REGULAR_HIDDEN_ITEMS",
  "FRUIT_TREES",
  "REGULAR_GIFTS",
  "TM_GIFTS",
  "HMS",
  "KEY_ITEMS",
  "MENU_ITEMS",
  "BADGES",
] as const

export type ItemLocationGroupId = typeof itemLocationGroupIds[number]