import { evolutionTypesMap } from "@shared/gameData/evolutionTypes"
import type { HoldableItemId, RegularItemId } from "@shared/types/gameDataIds/items"

export type EvolutionMethod = {
  typeId: typeof evolutionTypesMap.LEVEL.id,
  level: number,
} | {
  typeId: typeof evolutionTypesMap.ITEM.id,
  item: RegularItemId,
} | {
  typeId: typeof evolutionTypesMap.TRADE.id,
  item?: HoldableItemId,
} | {
  typeId: typeof evolutionTypesMap.HAPPINESS.id,
  conditionId: HappinessEvolutionConidtionId,
}
 | {
  typeId: typeof evolutionTypesMap.STAT.id,
  level: number,
  conditionId: StatEvolutionConidtionId,
}

const happinessEvolutionConidtionIds = [
  "NONE",
  "DAY",
  "NIGHT",
] as const

type HappinessEvolutionConidtionId = typeof happinessEvolutionConidtionIds[number]

type HappinessEvolutionConidtion = {
  id: HappinessEvolutionConidtionId,
  numericId: number,
}

export const happinessEvolutionConidtionsMap: IdMap<HappinessEvolutionConidtionId, HappinessEvolutionConidtion> = {
  NONE: {
    id: "NONE",
    numericId: 1,
  },
  DAY: {
    id: "DAY",
    numericId: 2,
  },
  NIGHT: {
    id: "NIGHT",
    numericId: 3,
  },
}

const statEvolutionConidtionIds = [
  "ATTACK_GREATER_THAN_DEFENCE",
  "ATTACK_LESS_THAN_DEFENCE",
  "ATTACK_EQUAL_DEFENCE",
] as const

type StatEvolutionConidtionId = typeof statEvolutionConidtionIds[number]

type StatEvolutionConidtion = {
  id: StatEvolutionConidtionId,
  numericId: number,
}

export const statEvolutionConidtionsMap: IdMap<StatEvolutionConidtionId, StatEvolutionConidtion> = {
  ATTACK_GREATER_THAN_DEFENCE: {
    id: "ATTACK_GREATER_THAN_DEFENCE",
    numericId: 1,
  },
  ATTACK_LESS_THAN_DEFENCE: {
    id: "ATTACK_LESS_THAN_DEFENCE",
    numericId: 2,
  },
  ATTACK_EQUAL_DEFENCE: {
    id: "ATTACK_EQUAL_DEFENCE",
    numericId: 3,
  },
}