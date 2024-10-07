import type { OddEgg } from "@shared/types/gameData/oddEgg"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import { compact } from "@shared/utils"
import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const oddEggsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/events/odd_eggs.asm"), "utf-8")

const oddEggs = [...oddEggsFileText.matchAll(/db(.+\n){24,24}.*/g)].map((oddEggMatch) => {
  const lines = oddEggMatch[0].split("\n")
  
  const movesMatches = [...lines[2].matchAll(/(?:\s+(\S+)(?:,|$))+?/g)]
  const ppMatches = [...lines[12].matchAll(/(?:\s+(\S+)(?:,|$))+?/g)]
  const dvMatches = [...lines[11].matchAll(/(?:\s+(\S+)(?:,|\s+;))+?/g)]
  
  const oddEgg: OddEgg = {
    pokemonId: lines[0].match(/db\s+(\S+)/)![1] as PokemonId,
    moves: compact(movesMatches.map((moveMatch, index) => {
      if (moveMatch[1] === "0") {
        return undefined
      } else {
        return {
          id: moveMatch[1] as MoveId,
          pp: parseInt(ppMatches[index][1]),
        }
      }
    })),
    ot: parseInt(lines[3].match(/dw\s+(\S+)/)![1]),
    experience: parseInt(lines[4].match(/dt\s+(\S+)/)![1]),
    statExperience: {
      hp: 0,
      attack: 0,
      defence: 0,
      speed: 0,
      special: 0,
    },
    dvs: {
      attack: parseInt(dvMatches[0][1]),
      defence: parseInt(dvMatches[1][1]),
      speed: parseInt(dvMatches[2][1]),
      special: parseInt(dvMatches[3][1]),
    },
    hatchCyclesRemaining: parseInt(lines[13].match(/db\s+(\S+)/)![1]),
    level: 5,
    stats: {
      hp: parseInt(lines[18].match(/bigdw\s+(\S+)/)![1]),
      attack: parseInt(lines[19].match(/bigdw\s+(\S+)/)![1]),
      defence: parseInt(lines[20].match(/bigdw\s+(\S+)/)![1]),
      speed: parseInt(lines[21].match(/bigdw\s+(\S+)/)![1]),
      specialAttack: parseInt(lines[22].match(/bigdw\s+(\S+)/)![1]),
      specialDefence: parseInt(lines[23].match(/bigdw\s+(\S+)/)![1]),
    },
    name: "EGG@@@@@@@@",
  }
  
  return oddEgg
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "oddEggs.json"), JSON.stringify(oddEggs, null, 2), "utf-8")