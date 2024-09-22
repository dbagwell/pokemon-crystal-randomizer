import type { GrowthRate } from "@shared/types/gameData/growthRate"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"

export const growthRatesMap: IdMap<GrowthRateId, GrowthRate> = {
  FAST: {
    id: "FAST",
    numericId: 4,
    name: "Fast",
  },
  MEDIUM_FAST: {
    id: "MEDIUM_FAST",
    numericId: 0,
    name: "Medium-Fast",
  },
  MEDIUM_SLOW: {
    id: "MEDIUM_SLOW",
    numericId: 3,
    name: "Medium-Slow",
  },
  SLOW: {
    id: "SLOW",
    numericId: 5,
    name: "Slow",
  },
}