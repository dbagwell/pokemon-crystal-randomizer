export const itemCategoryIds = [
  "MENU_ITEMS",
  "BADGES",
  "KEY_ITEMS",
  "HMS",
  "TMS",
  "REGULAR_ITEMS",
  "BALLS",
] as const

export type ItemCategoryId = typeof itemCategoryIds[number]