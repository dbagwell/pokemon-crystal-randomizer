import type { EvolutionType } from "@shared/types/gameData/evolutionType"
import type { EvolutionTypeId } from "@shared/types/gameDataIds/evolutionTypes"

export const evolutionTypesMap: IdMap<EvolutionTypeId, EvolutionType> = {
  LEVEL: {
    id: "LEVEL",
    numericId: 1,
  },
  ITEM: {
    id: "ITEM",
    numericId: 2,
  },
  TRADE: {
    id: "TRADE",
    numericId: 3,
  },
  HAPPINESS: {
    id: "HAPPINESS",
    numericId: 4,
  },
  STAT: {
    id: "STAT",
    numericId: 5,
  },
}