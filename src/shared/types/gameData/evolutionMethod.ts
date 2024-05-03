import type { HoldableItemId, RegularItemId } from "@shared/types/gameDataIds/items"

export type EvolutionMethod = {
  type: "LEVEL",
  level: number,
} | {
  type: "TRADE",
  item?: HoldableItemId,
} | {
  type: "ITEM",
  item: RegularItemId,
} | {
  type: "HAPPINESS",
  time?: "DAY" | "NIGHT",
} | {
  type: "STAT",
  level: number,
  stats: "ATTACK_LESS_THAN_DEFENCE" | "ATTACK_GREATER_THAN_DEFENCE" | "ATTACK_EQUAL_DEFENCE"
}