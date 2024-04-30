import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { type Config } from "@shared/appData/defaultConfig"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import { type PokemonId } from "@shared/types/gameDataIds/pokemon"
import { type StarterLocationId, starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import hash from "object-hash"
import seedrandom from "seedrandom"

export const generateROM = (data: Buffer, customSeed: string | undefined, config: Config): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  let hunks: DataHunk[] = []
  const seed = customSeed ?? crypto.randomUUID()
  const rng = seedrandom(seed)
  const randomInt = (max: number): number => {
    return Math.floor(rng() * max)
  }
  
  // Pokemon
  
  const pokemonConfigs = config.subElementConfigs.POKEMON.subElementConfigs
  
  // Starter Pokemon
  
  const startersConfigs = pokemonConfigs.STARTERS.subElementConfigs
  
  // Custom Starter Pokemon
  
  const customStartersConfigs = startersConfigs.CUSTOM.subElementConfigs
  const assignedStarters: Partial<Record<StarterLocationId, PokemonId>> = {}
      
  starterLocationIds.forEach((locationId) => {
    assignedStarters[locationId] = customStartersConfigs[locationId].value
  })
  
  // Random Starter Pokemon
      
  if (startersConfigs.RANDOM.toggleValue) {
    const randomStartersConfigs = startersConfigs.RANDOM.subElementConfigs
    const isBanned = (pokemon: Pokemon) => {
      return randomStartersConfigs.BAN.selectedOptionIds.includes(pokemon.id)
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
          && (!randomStartersConfigs.UNIQUE.value || !isAssigned(pokemon))
          && (!randomStartersConfigs.MATCH_TYPE.value || matchesType(pokemon))
          && (!randomStartersConfigs.MATCH_STAGE.value || matchesStage(pokemon))
          && (!randomStartersConfigs.MATCH_EVOLUTIONS.value || matchesEvoltions(pokemon))
          && (!randomStartersConfigs.MATCH_SIMILAR_BST.toggleValue || baseStatDifference(pokemon) <= randomStartersConfigs.MATCH_SIMILAR_BST.subElementConfigs.THRESHOLD.value)
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
  
  // Items
  
  const itemsConfigs = config.subElementConfigs.ITEMS.subElementConfigs
  
  // Starting Inventory
  
  const startingInventoryConfigs = itemsConfigs.STARTING_INVENTORY.subElementConfigs
    
  let hasStartingInventory = false
  let pokedexPartsValue = 0
  let pokegearPartsValue = 0
  let johtoBadgesValue = 0
  let kantoBadgesValue = 0
  const bagItemValues: {itemId: string, itemAmount: string}[] = []
    
  Object.values(itemCategoriesMap).forEach((category) => {
    const categoryConfig = startingInventoryConfigs[category.id]
      
    categoryConfig.options.forEach((option) => {
      if (!categoryConfig.selectedOptionIds.includes(option.id)) {
        return
      }
        
      hasStartingInventory = true
        
      const item = itemsMap[option.id]
          
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
        bagItemValues.push({
          itemId: hexStringFrom(bytesFrom(item.numericId, 1)),
          // TODO: Look into if we can reorganize item categories to avoid this unnecessary coalescing.
          itemAmount: `[2]{${option.subElementConfigs?.AMOUNT.value ?? 0}}`, // If everything is correct, subElementConfigs should never be nullish here
        })
        break
      }
      }
    })
  })
  
  if (hasStartingInventory) {
    const startingItemsPatch = Patch.fromYAML(
      romInfo,
      "startingItems.yml",
      {
        items: bagItemValues.map((value) => {
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
  
  // Other
  
  const otherConfigs = config.subElementConfigs.OTHER.subElementConfigs
  
  // Additional Options
  
  const selectedAdditionalOptionIds = otherConfigs.ADDITIONAL_OPTIONS.selectedOptionIds
  
  if (selectedAdditionalOptionIds.length > 0) {
    const additionalOptionsPatch = Patch.fromYAML(
      romInfo,
      "additionalOptions.yml",
      {
        options: compact([
          selectedAdditionalOptionIds.includes("INSTANT_TEXT") ? "options/textSpeedWithInstantText.yml" : "options/textSpeed.yml",
          selectedAdditionalOptionIds.includes("HOLD_TO_MASH") ? "options/holdToMash.yml" : null,
          "options/battleScene.yml",
          "options/battleShift.yml",
          selectedAdditionalOptionIds.includes("NICKNAMES") ? "options/nicknames.yml" : null,
          "options/stereoSound.yml",
          selectedAdditionalOptionIds.includes("RIDE_MUSIC") ? "options/rideMusic.yml" : null,
          "options/menuAccount.yml",
          "options/printTone.yml",
          "options/frameType.yml",
        ]),
      },
    )
    
    hunks = [...hunks, ...additionalOptionsPatch.hunks]
  }
  
  // Base Patch
  
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