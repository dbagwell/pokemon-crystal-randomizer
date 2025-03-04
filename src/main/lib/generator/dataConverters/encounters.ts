import { gameMapGroupsMap } from "@shared/gameData/gameMapGroups"
import { gameMapsMap } from "@shared/gameData/gameMaps"
import { pokemonMap } from "@shared/gameData/pokemon"
import type { ContestEncounter, Encounter, FishingEncounter, FishingTimeGroupEncounter, LandEncounter, RockEncounter, TreeEncounter, WaterEncounter } from "@shared/types/gameData/encounter"
import { encounterRegions } from "@shared/types/gameData/gameMap"
import { fishingGroupIds } from "@shared/types/gameDataIds/fishingGroups"
import { fishingRodIds } from "@shared/types/gameDataIds/fishingRods"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import { treeGroupIds } from "@shared/types/gameDataIds/treeGroups"
import { isNotNullish } from "@shared/utils"

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

export const bytesFromLandAndWaterEncounters = (encounters: (LandEncounter | WaterEncounter)[]) => {
  const sortIndex = (encounter: LandEncounter | WaterEncounter) => {
    const timeIndex = encounter.type === "WATER" || encounter.time === "MORNING" ? 0 : encounter.time === "DAY" ? 10 : 20
    return timeIndex + encounter.slot
  }
  
  return [false, true].flatMap((isSwarm) => {
    return encounterRegions.flatMap((region) => {
      return ["LAND", "WATER"].filter((type) => {
        return type === "LAND" || !isSwarm
      }).flatMap((type) => {
        return [
          ...encounters.reduce((result: GameMapId[], encounter) => {
            if (result.includes(encounter.mapId) || encounter.type !== type || encounter.type === "LAND" && (encounter.isSwarm ?? false) !== isSwarm) {
              return result
            } else {
              return [
                ...result,
                encounter.mapId,
              ]
            }
          }, []).map((mapId) => {
            return gameMapsMap[mapId]
          }).filter((gameMap) => {
            return gameMap.encounterRegion === region && (
              isSwarm && isNotNullish(gameMap.swarmEncounterRates) ||
              !isSwarm && type === "LAND" && isNotNullish(gameMap.landEncounterRates) ||
              type === "WATER" && isNotNullish(gameMap.waterEncounterRate)
            )
          }).flatMap((gameMap) => {
            return [
              gameMapGroupsMap[gameMap.mapGroup].numericId,
              gameMap.numericId,
              ...!isSwarm ? type === "LAND" ? gameMap.landEncounterRates! : [gameMap.waterEncounterRate!] : gameMap.swarmEncounterRates!,
              ...encounters.filter((encounter) => {
                return encounter.mapId === gameMap.id
                  && encounter.type === type
                  && (
                    encounter.type === "LAND" && (encounter.isSwarm ?? false) === isSwarm
                    || encounter.type !== "LAND"
                  )
              }).toSorted((encounter1, encounter2) => {
                return sortIndex(encounter1) - sortIndex(encounter2)
              }).flatMap((encounter) => {
                return bytesFromEncounter(encounter)
              }),
            ]
          }),
          0xFF,
        ]
      })
    })
  })
}

export const bytesFromTreeAndRockEncounters = (treeEncounters: TreeEncounter[], rockEncounters: RockEncounter[]) => {
  return [
    ...treeGroupIds.flatMap((group) => {
      return ["COMMON", "RARE"].flatMap((rarity) => {
        return [
          ...treeEncounters.filter((encounter) => {
            return encounter.group === group
              && encounter.rarity === rarity
          }).toSorted((encounter1, encounter2) => {
            return encounter1.slot - encounter2.slot
          }).flatMap((encounter) => {
            return bytesFromEncounter(encounter)
          }),
          0xFF,
        ]
      })
    }),
    ...rockEncounters.toSorted((encounter1, encounter2) => {
      return encounter1.slot - encounter2.slot
    }).flatMap((encounter) => {
      return bytesFromEncounter(encounter)
    }),
    0xFF,
  ]
}

export const bytesFromFishingEncounters = (fishingEncounters: FishingEncounter[], fishingTimeGroupEncounters: FishingTimeGroupEncounter[]) => {
  return [
    ...fishingGroupIds.flatMap((group) => {
      return fishingRodIds.flatMap((rod) => {
        return fishingEncounters.filter((encounter) => {
          return encounter.group === group
            && encounter.rod === rod
        }).toSorted((encounter1, encounter2) => {
          return encounter1.slot - encounter2.slot
        }).flatMap((encounter) => {
          return bytesFromEncounter(encounter)
        })
      })
    }),
    ...Array(22).flatMap((_, index) => {
      return ["DAY", "NIGHT"].flatMap((time) => {
        return fishingTimeGroupEncounters.filter((encounter) => {
          return encounter.timeGroupIndex === index
            && encounter.time === time
        }).flatMap((encounter) => {
          return bytesFromEncounter(encounter)
        })
      })
    }),
  ]
}

export const bytesFromContestEncounters = (encounters: ContestEncounter[]) => {
  return encounters.toSorted((encounter1, enocunter2) => {
    return encounter1.slot - enocunter2.slot
  }).flatMap((encounter) => {
    return bytesFromEncounter(encounter)
  })
}

const bytesFromEncounter = (encounter: Encounter) => {
  switch (encounter.type) {
  case "LAND":
  case "WATER": {
    return [
      encounter.level,
      pokemonMap[encounter.pokemonId].numericId,
    ]
  }
  case "TREE":
  case "ROCK": {
    return [
      encounter.rate,
      pokemonMap[encounter.pokemonId].numericId,
      encounter.level,
    ]
  }
  case "FISHING": {
    if (encounter.isTimeGroup) {
      return [
        encounter.rate,
        0,
        encounter.timeGroupIndex,
      ]
    } else {
      return [
        encounter.rate,
        pokemonMap[encounter.pokemonId].numericId,
        encounter.level,
      ]
    }
  }
  case "FISHING_TIME_GROUP": {
    return [
      pokemonMap[encounter.pokemonId].numericId,
      encounter.level,
    ]
  }
  case "CONTEST": {
    return [
      encounter.rate,
      pokemonMap[encounter.pokemonId].numericId,
      encounter.minLevel,
      encounter.maxLevel,
    ]
  }
  }
}