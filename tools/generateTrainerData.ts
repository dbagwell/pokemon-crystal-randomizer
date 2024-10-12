import type { Trainer } from "@shared/types/gameData/trainer"
import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TrainerGroupId } from "@shared/types/gameDataIds/trainerGroups"
import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const trainerClassNamesFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/trainers/class_names.asm"), "utf-8")
const trainerPartiesFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/trainers/parties.asm"), "utf-8")

const trainerClassNames = [...trainerClassNamesFileText.matchAll(/li\s+"(.+)"/g)].map((match) => {
  return match[1].replace("#", "POKÉ").replace("<PKMN>", "PKMN")
})

const trainerClasses: any = {}
const trainerGroups: any = {}

const trainers = [...trainerPartiesFileText.matchAll(/(\S+)Group([\s\S]*?)((?=\n.*Group)|$)/g)].flatMap((groupMatch, groupIndex) => {
  const groupId = groupMatch[1].match(/PKMN|[A-Z]+[a-z]*|[0-9]+/g)!.map((string) => {
    return string.toUpperCase()
  }).join("_")
  
  const className = trainerClassNames[groupIndex]
  const classId = className.replaceAll("É", "E").replaceAll(" ", "_").replaceAll(".", "").replaceAll("♂", "M").replaceAll("♀", "F")
  trainerClasses[classId] = {
    id: classId,
    name: className,
  }
  
  trainerGroups[groupId] = {
    id: groupId,
    classId: classId,
  }
  
  return [...groupMatch[2].matchAll(/;.*\n\s*db\s+"(.+)@"\s*,\s*TRAINERTYPE_(\S+)\s*\n([\s\S]*?)\n.*-1/g)].map((trainerMatch) => {
    const trainerType = trainerMatch[2]
  
    const trainer: Trainer = {
      name: trainerMatch[1],
      groupId: groupId as TrainerGroupId,
      pokemon: trainerMatch[3].split("\n").map((pokemonLine) => {
        const lineMatches = pokemonLine.match(/db\s+(\S+)\s*,\s*(\S+)(?:\s*,\s*|$)(.*)/)!
        const itemAndMoves = lineMatches[3].replaceAll(/\s/g, "").split(",")
        let itemId: HoldableItemId | undefined
        
        if (trainerType === "ITEM" || trainerType === "ITEM_MOVES") {
          const maybeItemId = itemAndMoves.shift()
          
          if (maybeItemId !== "NO_ITEM") {
            itemId = maybeItemId as HoldableItemId
          }
        }
      
        return {
          id: lineMatches[2] === "MR__MIME" ? "MR_MIME" : lineMatches[2] as PokemonId,
          level: parseInt(lineMatches[1]),
          itemId: itemId,
          moves: trainerType === "MOVES" || trainerType === "ITEM_MOVES" ? itemAndMoves.filter((moveId) => {
            return moveId !== "NO_MOVE"
          }).map((moveId) => {
            return moveId === "PSYCHIC_M" ? "PSYCHIC" : moveId as MoveId
          }) : [] as MoveId[],
        }
      }),
    }
  
    return trainer
  })
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "trainerClassIds.json"), JSON.stringify(Object.keys(trainerClasses), null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "trainerClasses.json"), JSON.stringify(trainerClasses, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "trainerGroupIds.json"), JSON.stringify(Object.keys(trainerGroups), null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "trainerGroups.json"), JSON.stringify(trainerGroups, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "trainers.json"), JSON.stringify(trainers, null, 2), "utf-8")