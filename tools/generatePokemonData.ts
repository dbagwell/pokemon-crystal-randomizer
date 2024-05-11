import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import type { EvolutionMethod } from "@shared/types/gameData/evolutionMethod"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { EggGroupId } from "@shared/types/gameDataIds/eggGroups"
import type { EvolutionTypeId } from "@shared/types/gameDataIds/evolutionTypes"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"
import type { HMItemId, HoldableItemId, TMItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import type { PokemonTypeId } from "@shared/types/gameDataIds/pokemonTypes"
import type { MoveTutorId } from "@shared/types/gameDataIds/teachableMoves"
import { compact, isNotNullish, isNullish, mapToRecord } from "@shared/utils"
import fs from "fs"
import path from "path"

const pokecrystalPath = process.env.pokecrystalPath as string

const evosAttacksFile = fs.readFileSync(path.resolve(pokecrystalPath, "data/pokemon/evos_attacks.asm"), "utf-8")
const evosAttacksLinesGroups = [
  ...evosAttacksFile.matchAll(/(\S*)EvosAttacks:\s*\n([\s\S]*?)\n?\s*db 0.*\n([\s\S]*?)\n\s*db 0.*/g),
].map((matches) => {
  return {
    codeName: matches[1],
    evosLines: matches[2],
    attacksLines: matches[3],
  }
})

const eggMovesFile = fs.readFileSync(path.resolve(pokecrystalPath, "data/pokemon/egg_moves.asm"), "utf-8")
const eggMovesLinesGroups = [
  ...eggMovesFile.matchAll(/(\S*)EggMoves:\s*\n([\s\S]*?)\n\s*db -1.*/g),
].map((matches) => {
  return {
    codeName: matches[1],
    eggMovesLines: matches[2],
  }
})

const allPokemon: Pokemon[] = evosAttacksLinesGroups.map(({ codeName, evosLines, attacksLines }, index) => {
  const pokemonId = pokemonIds[index] as PokemonId
  const pokemonPathName = pokemonId === "MR_MIME" ? "mr__mime" : pokemonId.toLowerCase()
  const baseStatsFilePath = path.resolve(pokecrystalPath, "data/pokemon/base_stats", `${pokemonPathName}.asm`)
  const baseStatsFile = fs.readFileSync(baseStatsFilePath, "utf-8")
  const baseStatsLineMatches = baseStatsFile.match(/db\s*(\S*),\s*(\S*),\s*(\S*),\s*(\S*),\s*(\S*),\s*(\S*)/)!
  const genderRatioNumberMatches = baseStatsFile.match(/db\s*GENDER_F(\S*)[_\s]/)
  const teachableMovesLineMatches = baseStatsFile.match(/tmhm\s*([\s\S]*)\n\s*;\s*end/)!
  const teachableMoveIds = teachableMovesLineMatches[1].replaceAll(" ", "").replace("PSYCHIC_M", "PSYCHIC").split(",") as MoveId[]
  const teachableMoves = Object.values(teachableMovesMap).filter((move) => {
    return teachableMoveIds.includes(move.moveId)
  })
  
  const evolutions = compact(evosLines.split("\n").map((line) => {
    const matches = line.match(/db\s*EVOLVE_(\S*),\s*(\S*),\s*([^\s,]*)(,\s*(\S*))?/)
    
    if (isNullish(matches)) {
      return undefined
    }
    
    const typeId = matches[1] as EvolutionTypeId
    
    return {
      pokemonId: typeId === "STAT" ? matches[5] as PokemonId : matches[3] as PokemonId,
      method: {
        typeId: typeId,
        level: typeId === "LEVEL" || typeId === "STAT" ? parseInt(matches[2]) : undefined,
        item: typeId === "ITEM" || typeId === "TRADE" && matches[2] !== "-1" ? matches[2] : undefined,
        conditionId: typeId === "HAPPINESS"
          ? matches[2] === "TR_ANYTIME"
            ? "NONE"
            : matches[2] === "TR_MORNDAY"
              ? "DAY"
              : "NIGHT"
          : typeId === "STAT"
            ? matches[3] === "ATK_LT_DEF"
              ? "ATTACK_LESS_THAN_DEFENCE"
              : matches[3] === "ATK_GT_DEF"
                ? "ATTACK_GREATER_THAN_DEFENCE"
                : "ATTACK_EQUAL_DEFENCE"
            : undefined,
      } as EvolutionMethod,
    }
  }))
  
  return {
    id: pokemonId,
    numericId: index + 1,
    name: pokemonId === "NIDORAN_F" ? "Nidoran♀︎"
      : pokemonId === "NIDORAN_M" ? "Nidoran♂︎"
        : pokemonId === "FARFETCH_D" ? "Farfetch'd"
          : pokemonId === "MR_MIME" ? "Mr. Mime"
            : pokemonId === "HO_OH" ? "Ho-Oh"
              : pokemonId[0] + pokemonId.slice(1).toLowerCase(),
    baseStats: {
      hp: parseInt(baseStatsLineMatches[1]),
      attack: parseInt(baseStatsLineMatches[2]),
      defence: parseInt(baseStatsLineMatches[3]),
      speed: parseInt(baseStatsLineMatches[4]),
      specialAttack: parseInt(baseStatsLineMatches[5]),
      specialDefence: parseInt(baseStatsLineMatches[6]),
    },
    types: compact(baseStatsFile.match(/db\s*(\S*),\s*(\S*)\s*;\s*type/)!.slice(1).map((type) => {
      return type === "NONE" ? undefined : type === "PSYCHIC_TYPE" ? "PSYCHIC" : type
    })).reduce((result: string[], type) => {
      return result.includes(type) ? result : [
        ...result,
        type,
      ]
    }, []) as [PokemonTypeId, PokemonTypeId?],
    catchRate: parseInt(baseStatsFile.match(/db\s*(\S*)\s*;\s*catch/)![1]),
    baseExperience: parseInt(baseStatsFile.match(/db\s*(\S*)\s*;\s*base/)![1]),
    items: compact(baseStatsFile.match(/db\s*(\S*),\s*(\S*)\s*;\s*items/)!.slice(1).map((item) => {
      return item === "NO_ITEM" ? undefined : item
    })) as [HoldableItemId?, HoldableItemId?],
    genderRatio: isNotNullish(genderRatioNumberMatches) ? Math.ceil(254 * parseFloat(genderRatioNumberMatches[1]) / 100) : 255,
    eggCycles: parseInt(baseStatsFile.match(/db\s*(\S*)\s*;\s*step/)![1]),
    growthRate: baseStatsFile.match(/db\s*GROWTH_(\S*)\s*;\s*growth/)![1] as GrowthRateId,
    eggGroups: baseStatsFile.match(/dn\s*EGG_(\S*),\s*EGG_(\S*)\s*;\s*egg/)!.slice(1).reduce((result: string[], group) => {
      return result.includes(group) ? result : [
        ...result,
        group,
      ]
    }, []) as [EggGroupId, EggGroupId?],
    tmMoves: teachableMoves.filter((move) => {
      return move.type === "TM"
    }).map((move) => {
      return move.id as TMItemId
    }),
    hmMoves: teachableMoves.filter((move) => {
      return move.type === "HM"
    }).map((move) => {
      return move.id as HMItemId
    }),
    moveTutorMoves: teachableMoves.filter((move) => {
      return move.type === "MOVE_TUTOR"
    }).map((move) => {
      return move.id as MoveTutorId
    }),
    levelUpMoves: compact(attacksLines.split("\n").map((line) => {
      const matches = line.match(/db\s*(\S*),\s*(\S*)/)
      
      if (isNullish(matches)) {
        return undefined
      }
      
      return {
        moveId: matches[2].replace("PSYCHIC_M", "PSYCHIC") as MoveId,
        level: parseInt(matches[1]),
      }
    })),
    eggMoves: eggMovesLinesGroups.find((group) => {
      return group.codeName === codeName
    })?.eggMovesLines.split("\n").map((line) => {
      const matches = line.match(/db\s*(\S*)/)!
      return matches[1].replace("PSYCHIC_M", "PSYCHIC") as MoveId
    }),
    evolutions: evolutions.length > 0 ? evolutions : undefined,
    spriteDimensions: fs.readFileSync(path.resolve(pokecrystalPath, baseStatsFile.match(/INCBIN\s*"(\S*)"/)![1]))[0],
  }
})

const pokemonMap = mapToRecord(pokemonIds, (pokemonId) => {
  return allPokemon.find((pokemon) => {
    return pokemon.id === pokemonId
  })!
})

const outputPath = process.env.outputPath!
fs.mkdirSync(path.resolve(outputPath), { recursive: true })
fs.writeFileSync(path.resolve(outputPath, "pokemon.json"), JSON.stringify(pokemonMap, null, 2), "utf-8")