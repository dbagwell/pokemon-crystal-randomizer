import type { GameMap } from "@shared/types/gameData/gameMap"
import type { GameMapGroup } from "@shared/types/gameData/gameMapGroup"
import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
import type { GameMapGroupId } from "@shared/types/gameDataIds/gameMapGroups"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import type { TreeGroupId } from "@shared/types/gameDataIds/treeGroups"
import { isNotNullish } from "@shared/utils"
import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const mapConstastsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "constants/map_constants.asm"), "utf-8")
const johtoGrassFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/johto_grass.asm"), "utf-8")
const kantoGrassFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/kanto_grass.asm"), "utf-8")
const johtoWaterFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/johto_water.asm"), "utf-8")
const kantoWaterFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/kanto_water.asm"), "utf-8")
const swarmFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/swarm_grass.asm"), "utf-8")
const mapsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/maps/maps.asm"), "utf-8")
const treesMapsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/treemon_maps.asm"), "utf-8")

const fishingGroupMatches = [...mapsFileText.matchAll(/map\s(\S*),.*FISHGROUP_(\S*)/g)]
const treeGroupMatches = [...treesMapsFileText.matchAll(/treemon_map\s(\S*),.*TREEMON_SET_(\S*)/g)]
const mapGroupMatches = [...mapConstastsFileText.matchAll(/newgroup (\S*).*\n([\s\S]*?)\n\s*endgroup/g)]

const treeMapsWithoutTrees = [
  "ROUTE_28",
  "ROUTE_40",
  "ROUTE_41",
  "ROUTE_45",
  "ROUTE_46",
  "CHERRYGROVE_CITY",
  "GOLDENROD_CITY",
  "OLIVINE_CITY",
  "CIANWOOD_CITY",
  "BLACKTHORN_CITY",
  "SILVER_CAVE_OUTSIDE",
]

const mapGroupIds: string[] = []
const mapGroups: Partial<Record<GameMapGroupId, GameMapGroup>> = {}
const mapIds: string[] = []
const maps: Partial<Record<GameMapId, GameMap>> = {}

mapGroupMatches.forEach((matches, index) => {
  const mapGroupId = matches[1] as GameMapGroupId
  mapGroupIds.push(mapGroupId)
  
  mapGroups[mapGroupId] = {
    id: mapGroupId,
    numericId: index + 1,
  }
  
  const mapMatches = [...matches[2].matchAll(/map_const\s*(\S*),/g)]
  
  mapMatches.forEach((matches, index) => {
    const mapId = matches[1] as GameMapId
    mapIds.push(mapId)

    const fishingGroup = fishingGroupMatches.find((matches) => {
      return matches[1].toLowerCase() === mapId.replaceAll("_", "").toLowerCase()
    })?.[2]

    const treeGroup = treeGroupMatches.find((matches) => {
      return matches[1] === mapId
    })?.[2]
    
    let encounterRegion: "JOHTO" | "KANTO" | undefined
    let landEncounterRates: [number, number, number] | undefined
    let waterEncounterRate: number | undefined
    let swarmEncounterRates: [number, number, number] | undefined
    
    ;([
      ["JOHTO", johtoGrassFileText],
      ["KANTO", kantoGrassFileText],
    ] as const).forEach(([region, fileText]) => {
      const matches = [...fileText.matchAll(/def_grass_wildmons\s*(\S*).*\n\s*db\s*(\S*).*?,\s*(\S*).*?,\s*(\S*)/g)].find((matches) => {
        return matches[1] === mapId
      })
      
      if (isNotNullish(matches)) {
        encounterRegion = region
        landEncounterRates = [
          Math.floor(255 * parseFloat(matches[2]) / 100),
          Math.floor(255 * parseFloat(matches[3]) / 100),
          Math.floor(255 * parseFloat(matches[4]) / 100),
        ]
      }
    })
    
    ;([
      ["JOHTO", johtoWaterFileText],
      ["KANTO", kantoWaterFileText],
    ] as const).forEach(([region, fileText]) => {
      const matches = [...fileText.matchAll(/def_water_wildmons\s*(\S*).*\n\s*db\s*(\S*)/g)].find((matches) => {
        return matches[1] === mapId
      })
      
      if (isNotNullish(matches)) {
        encounterRegion = region
        waterEncounterRate = Math.floor(255 * parseFloat(matches[2]) / 100)
      }
    })
    
    const swarmMatches = [...swarmFileText.matchAll(/map_id\s*(\S*).*\n\s*db\s*(\S*).*?,\s*(\S*).*?,\s*(\S*)/g)].find((matches) => {
      return matches[1] === mapId
    })
    
    if (isNotNullish(swarmMatches)) {
      swarmEncounterRates = [
        Math.floor(255 * parseFloat(swarmMatches[2]) / 100),
        Math.floor(255 * parseFloat(swarmMatches[3]) / 100),
        Math.floor(255 * parseFloat(swarmMatches[4]) / 100),
      ]
    }
    
    maps[mapId] = {
      id: mapId,
      numericId: index + 1,
      mapGroup: mapGroupId,
      encounterRegion: encounterRegion,
      landEncounterRates: landEncounterRates,
      waterEncounterRate: waterEncounterRate,
      swarmEncounterRates: swarmEncounterRates,
      fishingGroup: !waterEncounterRate || fishingGroup === "NONE" ? undefined : fishingGroup === "QWILFISH_NO_SWARM" ? "QWILFISH" : fishingGroup as FishingGroupId,
      treeGroup: treeMapsWithoutTrees.includes(mapId) || treeGroup === "ROCK" ? undefined : treeGroup === "CITY" || treeGroup === "CANYON" ? "CANYON" : treeGroup as TreeGroupId,
    }
  })
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "mapGroupIds.json"), JSON.stringify(mapGroupIds, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "mapGroups.json"), JSON.stringify(mapGroups, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "mapIds.json"), JSON.stringify(mapIds, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "maps.json"), JSON.stringify(maps, null, 2), "utf-8")