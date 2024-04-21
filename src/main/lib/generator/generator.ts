import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { ItemId } from "@shared/types/gameDataIds/items"
import { type PokemonId } from "@shared/types/gameDataIds/pokemon"
import { type StarterLocationId, starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish, isNumber, isString } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import hash from "object-hash"
import seedrandom from "seedrandom"

export const generateROM = (data: Buffer, settings: any): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  let hunks: DataHunk[] = []
  const seed = isString(settings.seed) ? settings.seed : crypto.randomUUID()
  const rng = seedrandom(seed)
  const randomInt = (max: number): number => {
    return Math.floor(rng() * max)
  }
  
  // TODO: Iterator over object entries instead and switch over known keys
  if (isNotNullish(settings.other)) {
    const other = settings.other
    
    if (isNotNullish(other.additionalOptions)) {
      const additionalOptions = other.additionalOptions
      
      if (!Array.isArray(additionalOptions)) {
        throw new Error("'other.additionalOptions' must be an array.")
      }
      
      // TODO: Record warnings if array contains values that don't match expected values.
      // TODO: Pull additional options values from shared to ensure the ui sends the same values.
      
      const additionalOptionsPatch = Patch.fromYAML(
        romInfo,
        "additionalOptions.yml",
        {
          options: compact([
            additionalOptions.includes(additionalOptionsMap.INSTANT_TEXT.id) ? "options/textSpeedWithInstantText.yml" : "options/textSpeed.yml",
            additionalOptions.includes(additionalOptionsMap.HOLD_TO_MASH.id) ? "options/holdToMash.yml" : null,
            "options/battleScene.yml",
            "options/battleShift.yml",
            additionalOptions.includes(additionalOptionsMap.NICKNAMES.id) ? "options/nicknames.yml" : null,
            "options/stereoSound.yml",
            additionalOptions.includes(additionalOptionsMap.RIDE_MUSIC.id) ? "options/rideMusic.yml" : null,
            "options/menuAccount.yml",
            "options/printTone.yml",
            "options/frameType.yml",
          ]),
        },
      )
      
      hunks = [...hunks, ...additionalOptionsPatch.hunks]
    }
  }
  
  if (isNotNullish(settings.pokemon)) {
    if (isNotNullish(settings.pokemon.starters)) {
      const assignedStarters: Partial<Record<StarterLocationId, PokemonId>> = {}
      
      if (isNotNullish(settings.pokemon.starters.custom)) {
        starterLocationIds.forEach((locationId) => {
          assignedStarters[locationId] = settings.pokemon.starters.custom[locationId] // TODO: We'll validate this as part of an initial all settings validation step.
        })
      }
      
      if (isNotNullish(settings.pokemon.starters.random)) {
        const options = settings.pokemon.starters.random
        
        const isBanned = (pokemon: Pokemon) => {
          return Array.isArray(options.ban) && options.ban.includes(pokemon.id)
        }
        
        const isAssigned = (pokemon: Pokemon) => {
          return isNotNullish(Object.values(assignedStarters).find((assignedStarterId) => {
            return assignedStarterId === pokemon.id
          }))
        }
          
        const matchesStage = (pokemon: Pokemon) => {
          return !Object.values(pokemonMap).flatMap((pokemon) => {
            return pokemon.evolutions?.map((evolution) => {
              return evolution.pokemonId
            }) ?? []
          }).includes(pokemon.id)
        }
        
        starterLocationIds.forEach((locationId) => {
          if (isNotNullish(assignedStarters[locationId])) {
            return
          }
          
          const vanillaStarter = pokemonMap[starterLocationsMap[locationId].pokemonId]
        
          const matchesType = (pokemon: Pokemon) => {
            return pokemon.types.includes(vanillaStarter.types[0]) // Vanilla starters only have 1 type each
          }
          
          const matchesEvoltions = (pokemon: Pokemon) => {
            return maxNumberOfEvolutionStages(pokemon) === maxNumberOfEvolutionStages(vanillaStarter)
          }
          
          const baseStatDifference = (pokemon: Pokemon) => {
            return Math.abs(baseStatTotal(pokemon) - baseStatTotal(vanillaStarter))
          }
          
          const choices = Object.values(pokemonMap).filter((pokemon) => {
            return !isBanned(pokemon)
              && (!options.preventDuplicates || !isAssigned(pokemon))
              && (!options.matchType || matchesType(pokemon))
              && (!options.matchStage || matchesStage(pokemon))
              && (!options.matchEvolutions || matchesEvoltions(pokemon))
              && (isNullish(options.matchStatsThreshold) || baseStatDifference(pokemon) <= options.matchStatsThreshold)
          })
          
          const index = randomInt(choices.length - 1)
          assignedStarters[locationId] = choices[index].id
        })
      }
      
      Object.entries(assignedStarters).forEach(([locationId, pokemonId]) => {
        if (isNullish(pokemonId)) {
          return
        }
        
        hunks = [
          ...hunks,
          ...Patch.fromYAML(
            romInfo,
            `starters/${locationId.toLowerCase()}.yml`,
            {},
            {
              pokemonId: hexStringFrom(bytesFrom(pokemonMap[pokemonId].numericId, 1)),
            },
          ).hunks,
        ]
      })
    }
  }
  
  if (isNotNullish(settings.items)) {
    const items = settings.items
    if (isNotNullish(items.startingInventory)) {
      const startingInventory = items.startingInventory
      
      let pokedexPartsValue = 0
      let pokegearPartsValue = 0
      let johtoBadgesValue = 0
      let kantoBadgesValue = 0
      const itemValues: {itemId: string, itemAmount: string}[] = []
      
      Object.values(itemCategoriesMap).forEach((category) => {
        if (isNotNullish(startingInventory[category.id])) {
          const selectedItems = startingInventory[category.id]
          
          if (!Array.isArray(selectedItems)) {
            throw new Error(`'items.startingInventory.${category.id} must be an array.`)
          } else if (selectedItems.length > category.maxSlots) {
            throw new Error(`'items.startingInventory.${category.id}' cannot have more than ${category.maxSlots} entries.`)
          }
          
          const mappedItems = selectedItems.reduce((items, selectedItemInfo) => {
            if (isString(selectedItemInfo)) {
              return {
                ...items,
                [selectedItemInfo]: 1,
              }
            } else {
              return {
                ...items,
                ...selectedItemInfo,
              }
            }
          }, {})
          
          Object.entries(mappedItems).forEach(([itemId, amount]) => {
            const item = itemsMap[itemId as ItemId]
            if (!isNumber(amount) || !Number.isInteger(amount) || amount > category.slotSize) {
              throw new Error(`Item amounts in 'items.startingInventory.${category.id}' cannot exceed ${category.slotSize}.`)
            }
              
            switch (item.type) {
            case "POKEDEX_PART": {
              pokedexPartsValue |= item.numericId
              break
            }
            case "POKEGEAR_PART": {
              pokegearPartsValue |= item.numericId
              break
            }
            case "JOHTO_BADGE": {
              johtoBadgesValue |= item.numericId
              break
            }
            case "KANTO_BADGE": {
              kantoBadgesValue |= item.numericId
              break
            }
            case "BAG_ITEM": {
              itemValues.push({
                itemId: hexStringFrom(bytesFrom(item.numericId, 1)),
                itemAmount: `[2]{${amount}}`,
              })
              break
            }
            }
          })
        }
      })
      
      const startingItemsPatch = Patch.fromYAML(
        romInfo,
        "startingItems.yml",
        {
          items: itemValues.map((value) => {
            return {
              path: "giveItem.yml",
              extraValues: value,
            }
          }),
        },
        {
          pokedexParts: hexStringFrom([pokedexPartsValue]),
          pokegearParts: hexStringFrom([pokegearPartsValue]),
          johtoBadges: hexStringFrom([johtoBadgesValue]),
          kantoBadges: hexStringFrom([kantoBadgesValue]),
        }
      )
  
      hunks = [...hunks, ...startingItemsPatch.hunks]
    }
  }
  
  const checkValue = hunks.length > 0 ? hash(hunks).slice(0, 8).toUpperCase() : "00000000"
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion()), " "),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue), " "),
    },
  )
      
  hunks = [...hunks, ...basePatch.hunks]
  
  hunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}