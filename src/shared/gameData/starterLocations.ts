import type { StarterLocation } from "@shared/types/gameData/starterLocation"
import type { StarterLocationId } from "@shared/types/gameDataIds/starterLocations"

export const starterLocationsMap: IdMap<StarterLocationId, StarterLocation> = {
  LEFT: {
    id: "LEFT",
    pokemonId: "CYNDAQUIL",
    name: "Left (Cyndaquil)",
    itemRomOffset: [
      30,
      0x4CA5,
    ],
  },
  MIDDLE: {
    id: "MIDDLE",
    pokemonId: "TOTODILE",
    name: "Middle (Totodile)",
    itemRomOffset: [
      30,
      0x4CE7,
    ],
  },
  RIGHT: {
    id: "RIGHT",
    pokemonId: "CHIKORITA",
    name: "Right (Chikorita)",
    itemRomOffset: [
      30,
      0x4D23,
    ],
  },
}