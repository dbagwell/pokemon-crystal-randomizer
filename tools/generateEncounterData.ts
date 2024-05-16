import type { Encounter } from "@shared/types/gameData/encounter"
import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
import { type GameMapId } from "@shared/types/gameDataIds/gameMaps"
import { type PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TreeGroupId } from "@shared/types/gameDataIds/treeGroups"
import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const johtoGrassFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/johto_grass.asm"), "utf-8")
const kantoGrassFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/kanto_grass.asm"), "utf-8")
const johtoWaterFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/johto_water.asm"), "utf-8")
const kantoWaterFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/kanto_water.asm"), "utf-8")
const swarmFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/swarm_grass.asm"), "utf-8")
const fishFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/fish.asm"), "utf-8")
const treemonsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/wild/treemons.asm"), "utf-8")

const timeMap = {
  morn: "MORNING",
  day: "DAY",
  nite: "NIGHT",
} as const

const encounters: Encounter[] = []

;[
  johtoGrassFileText,
  kantoGrassFileText,
  swarmFileText,
].forEach((fileText) => {
  [...fileText.matchAll(/(def_grass_wildmons|map_id)\s*(\S*).*\n.*\n([\s\S]*?)(\n\s*end_grass_wildmons|\n\s*\n)/g)].forEach((mapMatches) => {
    [...mapMatches[3].matchAll(/;\s(\S*).*\n(.*\n.*\n.*\n.*\n.*\n.*\n.*)/g)].forEach((timeMatches) => {
      timeMatches[2].split("\n").map((line) => {
        return line.match(/db\s*(\S*),\s*(\S*)/)!
      }).forEach((encounterMatches, index) => {
        encounters.push({
          pokemonId: encounterMatches[2].replace("__", "_") as PokemonId,
          level: parseInt(encounterMatches[1]),
          type: "LAND",
          mapId: mapMatches[2] as GameMapId,
          isSwarm: mapMatches[1] === "map_id" ? true : undefined,
          time: timeMap[timeMatches[1] as keyof typeof timeMap],
          slot: index,
        })
      })
    })
  })
})

;[
  johtoWaterFileText,
  kantoWaterFileText,
].forEach((fileText) => {
  [...fileText.matchAll(/def_water_wildmons\s*(\S*).*\n.*\n([\s\S]*?)\n\s*end_water_wildmons/g)].forEach((mapMatches) => {
    mapMatches[2].split("\n").map((line) => {
      return line.match(/db\s*(\S*),\s*(\S*)/)!
    }).forEach((encounterMatches, index) => {
      encounters.push({
        pokemonId: encounterMatches[2].replace("__", "_") as PokemonId,
        level: parseInt(encounterMatches[1]),
        type: "WATER",
        mapId: mapMatches[1] as GameMapId,
        slot: index,
      })
    })
  })
})

;[...fishFileText.matchAll(/([^.]*)_(Old|Good|Super):\s*\n([^.][\s\S]*?)(\n\.|\n\s*\n)/g)].forEach((rodGroupMatches) => {
  rodGroupMatches[3].split("\n").map((line) => {
    return line.match(/db\s*(\S*)(.*?),\s*((\S*),\s*(\S*)|(time_group)\s*(\S*))/)!
  }).forEach((encounterMatches) => {
    const isSwarm = rodGroupMatches[1].includes("_Swarm")
    const floatRate = 255 * parseFloat(encounterMatches[1]) / 100
    const basicInfo = {
      type: "FISHING" as const,
      group: rodGroupMatches[1].replace("_Swarm", "").replace("I", "_I").toUpperCase() as FishingGroupId,
      rod: rodGroupMatches[2].toUpperCase() as ("OLD" | "GOOD" | "SUPER"),
      isSwarm: isSwarm ? isSwarm : undefined,
      rate: encounterMatches[2].includes("+") ? Math.ceil(floatRate) : Math.floor(floatRate),
    }
    
    if (encounterMatches[6] === "time_group") {
      encounters.push({
        ...basicInfo,
        isTimeGroup: true,
        timeGroupIndex: parseInt(encounterMatches[7]),
      })
    } else {
      encounters.push({
        pokemonId: encounterMatches[4].replace("__", "_") as PokemonId,
        level: parseInt(encounterMatches[5]),
        ...basicInfo,
        isTimeGroup: false,
      })
    }
  })
})

;[...fishFileText.matchAll(/db\s*(\S*),\s*(\S*),\s*(\S*),\s*(\S*)/g)].forEach((encountersMatches, index) => {
  encounters.push({
    pokemonId: encountersMatches[1].replace("__", "_") as PokemonId,
    level: parseInt(encountersMatches[2]),
    type: "FISHING_TIME_GROUP",
    timeGroupIndex: index,
    time: "DAY",
  })
  
  encounters.push({
    pokemonId: encountersMatches[3].replace("__", "_") as PokemonId,
    level: parseInt(encountersMatches[4]),
    type: "FISHING_TIME_GROUP",
    timeGroupIndex: index,
    time: "NIGHT",
  })
})

;[...treemonsFileText.matchAll(/TreeMonSet_(\S*):.*\n([^T][\s\S]*?)\n\s*(db\s*-1\s*$|\n)/g)].forEach((groupMatches) => {
  if (groupMatches[1] === "Rock") {
    groupMatches[2].split("\n").map((line) => {
      return line.match(/db\s*(\S*),\s*(\S*),\s*(\S*)/)
    }).forEach((encounterMatches) => {
      if (!encounterMatches) {
        return
      }
      
      encounters.push({
        pokemonId: encounterMatches[2].replace("__", "_") as PokemonId,
        level: parseInt(encounterMatches[3]),
        type: "ROCK",
        rate: parseInt(encounterMatches[1]),
      })
    })
  } else {
    [...groupMatches[2].matchAll(/;\s(\S*).*\n(.*\n.*\n.*\n.*\n.*\n.*)\s*db\s*-1/g)].forEach((rarityMatches) => {
      rarityMatches[2].split("\n").map((line) => {
        return line.match(/db\s*(\S*),\s*(\S*),\s*(\S*)/)!
      }).forEach((encounterMatches) => {
        encounters.push({
          pokemonId: encounterMatches[2].replace("__", "_") as PokemonId,
          level: parseInt(encounterMatches[3]),
          type: "TREE",
          group: groupMatches[1].toUpperCase() as TreeGroupId,
          rarity: rarityMatches[1].toUpperCase() as ("COMMON" | "RARE"),
          rate: parseInt(encounterMatches[1]),
        })
      })
    })
  }
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "encounters.json"), JSON.stringify(encounters, null, 2), "utf-8")