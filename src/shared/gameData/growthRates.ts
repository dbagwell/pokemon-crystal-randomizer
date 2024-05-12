import type { GrowthRate } from "@shared/types/gameData/growthRate"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"

export const growthRatesMap: IdMap<GrowthRateId, GrowthRate> = {
  FAST: {
    id: "FAST",
    numericId: 4,
  },
  MEDIUM_FAST: {
    id: "MEDIUM_FAST",
    numericId: 0,
  },
  MEDIUM_SLOW: {
    id: "MEDIUM_SLOW",
    numericId: 3,
  },
  SLOW: {
    id: "SLOW",
    numericId: 5,
  },
}