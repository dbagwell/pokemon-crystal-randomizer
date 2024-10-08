import type { OverworldSpritePallet } from "@shared/types/gameData/overworldSpritePallet"
import type { OverworldSpritePalletId } from "@shared/types/gameDataIds/overworldSpritePallets"

export const overworldSpritePalletsMap: IdMap<OverworldSpritePalletId, OverworldSpritePallet> = {
  RED: {
    id: "RED",
    numericId: 8,
  },
  BLUE: {
    id: "BLUE",
    numericId: 9,
  },
  GREEN: {
    id: "GREEN",
    numericId: 10,
  },
  BROWN: {
    id: "BROWN",
    numericId: 11,
  },
  PINK: {
    id: "PINK",
    numericId: 12,
  },
  EMOTE: {
    id: "EMOTE",
    numericId: 13,
  },
  TREE: {
    id: "TREE",
    numericId: 14,
  },
  ROCK: {
    id: "ROCK",
    numericId: 15,
  },
} as const