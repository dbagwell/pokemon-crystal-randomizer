import type { EggGroup } from "@shared/types/gameData/eggGroup"
import type { EggGroupId } from "@shared/types/gameDataIds/eggGroups"

export const eggGroupsMap: IdMap<EggGroupId, EggGroup> = {
  MONSTER: {
    id: "MONSTER",
    numericId: 1,
  },
  WATER_1: {
    id: "WATER_1",
    numericId: 2,
  },
  BUG: {
    id: "BUG",
    numericId: 3,
  },
  FLYING: {
    id: "FLYING",
    numericId: 4,
  },
  GROUND: {
    id: "GROUND",
    numericId: 5,
  },
  FAIRY: {
    id: "FAIRY",
    numericId: 6,
  },
  PLANT: {
    id: "PLANT",
    numericId: 7,
  },
  HUMANSHAPE: {
    id: "HUMANSHAPE",
    numericId: 8,
  },
  WATER_3: {
    id: "WATER_3",
    numericId: 9,
  },
  MINERAL: {
    id: "MINERAL",
    numericId: 10,
  },
  INDETERMINATE: {
    id: "INDETERMINATE",
    numericId: 11,
  },
  WATER_2: {
    id: "WATER_2",
    numericId: 12,
  },
  DITTO: {
    id: "DITTO",
    numericId: 13,
  },
  DRAGON: {
    id: "DRAGON",
    numericId: 14,
  },
  NONE: {
    id: "NONE",
    numericId: 15,
  },
}