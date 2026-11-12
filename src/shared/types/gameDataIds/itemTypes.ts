export const menuItemTypes = [
  "POKEDEX_PART",
  "POKEGEAR_PART",
] as const

export const badgeItemTypes = [
  "JOHTO_BADGE",
  "KANTO_BADGE",
] as const
  
export const bagItemType = "BAG_ITEM" as const
export const apItemType = "AP_ITEM" as const

export type MenuItemType = typeof menuItemTypes[number]
export type BadgeItemType = typeof badgeItemTypes[number]
export type BagItemType = typeof bagItemType
export type APItemType = typeof apItemType

export type ItemType =
  | MenuItemType
  | BadgeItemType
  | BagItemType
  | APItemType