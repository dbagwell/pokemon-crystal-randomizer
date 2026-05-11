import type { ContestEncounter, Encounter, FishingEncounter, FishingTimeGroupEncounter, LandEncounter, RockEncounter, TreeEncounter, WaterEncounter } from "@shared/types/gameData/encounter"

export const encountersGroupedByType = (encounters: Encounter[]) => {
  const groups = {
    landAndWaterEncounters: [] as (LandEncounter | WaterEncounter)[],
    treeEncounters: [] as TreeEncounter[],
    rockEnounters: [] as RockEncounter[],
    fishingEncounters: [] as FishingEncounter[],
    fishingTimeGroupEncounters: [] as FishingTimeGroupEncounter[],
    contestEncounters: [] as ContestEncounter[],
  }
  
  encounters.forEach((encounter) => {
    switch (encounter.type) {
    case "LAND":
    case "WATER": {
      groups.landAndWaterEncounters.push(encounter)
      break
    }
    case "TREE": {
      groups.treeEncounters.push(encounter)
      break
    }
    case "ROCK": {
      groups.rockEnounters.push(encounter)
      break
    }
    case "FISHING": {
      groups.fishingEncounters.push(encounter)
      break
    }
    case "FISHING_TIME_GROUP": {
      groups.fishingTimeGroupEncounters.push(encounter)
      break
    }
    case "CONTEST": {
      groups.contestEncounters.push(encounter)
      break
    }
    }
  })
  
  return groups
}