import type { StarterLocation } from "@shared/types/gameData/starterLocation"
import type { StarterLocationId } from "@shared/types/gameDataIds/starterLocations"

export const starterLocationsMap: IdMap<StarterLocationId, StarterLocation> = {
  LEFT: {
    id: "LEFT",
    pokemonId: "CYNDAQUIL",
    name: "Left (Cyndaquil)",
  },
  MIDDLE: {
    id: "MIDDLE",
    pokemonId: "TOTODILE",
    name: "Middle (Totodile)",
  },
  RIGHT: {
    id: "RIGHT",
    pokemonId: "CHIKORITA",
    name: "Right (Chikorita)",
  },
}