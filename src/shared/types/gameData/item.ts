import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { ItemType } from "@shared/types/gameDataIds/itemTypes"

export type Item = {
  id: ItemId
  type: ItemType
  category: ItemCategoryId
  numericId: number
  inGameName: string
  name: string
  price: number
  holdEffectId: ItemHoldEffectId
  associatedValue: number
  isRegisterable: boolean
  isTossable: boolean
  fieldMenuAction: ItemMenuActionId
  battleMenuAction: ItemMenuActionId
}

export const itemMenuActionIds = [
  "NONE",
  "STAY",
  "OPEN_PARTY",
  "CLOSE",
] as const

export type ItemMenuActionId = typeof itemMenuActionIds[number]

export const itemMenuActionsMap: Record<ItemMenuActionId, number> = {
  NONE: 0,
  STAY: 4,
  OPEN_PARTY: 5,
  CLOSE: 6,
} as const

export const itemHoldEffectIds = [
  "NONE",
  "BERRY",
  "LEFTOVERS",
  "RESTORE_PP",
  "CLEANSE_TAG",
  "HEAL_POISON",
  "HEAL_FREEZE",
  "HEAL_BURN",
  "HEAL_SLEEP",
  "HEAL_PARALYZE",
  "HEAL_STATUS",
  "HEAL_CONFUSION",
  "METAL_POWDER",
  "NORMAL_BOOST",
  "FIGHTING_BOOST",
  "FLYING_BOOST",
  "POISON_BOOST",
  "GROUND_BOOST",
  "ROCK_BOOST",
  "BUG_BOOST",
  "GHOST_BOOST",
  "FIRE_BOOST",
  "WATER_BOOST",
  "GRASS_BOOST",
  "ELECTRIC_BOOST",
  "PSYCHIC_BOOST",
  "ICE_BOOST",
  "DRAGON_BOOST",
  "DARK_BOOST",
  "STEEL_BOOST",
  "ESCAPE",
  "CRITICAL_UP",
  "QUICK_CLAW",
  "FLINCH",
  "AMULET_COIN",
  "BRIGHTPOWDER",
  "FOCUS_BAND",
] as const

export type ItemHoldEffectId = typeof itemHoldEffectIds[number]

export const itemHoldEffectsMap: Record<ItemHoldEffectId, number> = {
  NONE: 0,
  BERRY: 1,
  LEFTOVERS: 3,
  RESTORE_PP: 6,
  CLEANSE_TAG: 8,
  HEAL_POISON: 10,
  HEAL_FREEZE: 11,
  HEAL_BURN: 12,
  HEAL_SLEEP: 13,
  HEAL_PARALYZE: 14,
  HEAL_STATUS: 15,
  HEAL_CONFUSION: 16,
  METAL_POWDER: 42,
  NORMAL_BOOST: 50,
  FIGHTING_BOOST: 51,
  FLYING_BOOST: 52,
  POISON_BOOST: 53,
  GROUND_BOOST: 54,
  ROCK_BOOST: 55,
  BUG_BOOST: 56,
  GHOST_BOOST: 57,
  FIRE_BOOST: 58,
  WATER_BOOST: 59,
  GRASS_BOOST: 60,
  ELECTRIC_BOOST: 61,
  PSYCHIC_BOOST: 62,
  ICE_BOOST: 63,
  DRAGON_BOOST: 64,
  DARK_BOOST: 65,
  STEEL_BOOST: 66,
  ESCAPE: 72,
  CRITICAL_UP: 73,
  QUICK_CLAW: 74,
  FLINCH: 75,
  AMULET_COIN: 76,
  BRIGHTPOWDER: 77,
  FOCUS_BAND: 79,
} as const