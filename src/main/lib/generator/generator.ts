import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { type Settings } from "@shared/appData/configHelpers"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { baseStatTotal, maxNumberOfEvolutionStages } from "@shared/gameData/pokemonHelpers"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { ItemId } from "@shared/types/gameDataIds/items"
import { type PokemonId } from "@shared/types/gameDataIds/pokemon"
import { type StarterLocationId, starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { bytesFrom, compact, hexStringFrom, isNotNullish, isNullish, isString } from "@utils"
import crypto from "crypto"
import { app } from "electron"
import hash from "object-hash"
import seedrandom from "seedrandom"

export const generateROM = (data: Buffer, customSeed: string | undefined, settings: Settings): {
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
  
  const pokemonSettings = settings.POKEMON
  
  // Starter Pokemon
  
  const startersSettings = pokemonSettings.STARTERS
  
  // Custom Starter Pokemon
  
  const customStartersSettings = startersSettings.CUSTOM
  const assignedStarters: Partial<Record<StarterLocationId, PokemonId>> = {}
      
  starterLocationIds.forEach((locationId) => {
    assignedStarters[locationId] = customStartersSettings[locationId]
  })
  
  // Random Starter Pokemon
      
  if (startersSettings.RANDOM) {
    const randomStartersSettings = startersSettings.RANDOM
    const isBanned = (pokemon: Pokemon) => {
      return randomStartersSettings.BAN.includes(pokemon.id)
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
          && (!randomStartersSettings.UNIQUE || !isAssigned(pokemon))
          && (!randomStartersSettings.MATCH_TYPE || matchesType(pokemon))
          && (!randomStartersSettings.MATCH_STAGE || matchesStage(pokemon))
          && (!randomStartersSettings.MATCH_EVOLUTIONS || matchesEvoltions(pokemon))
          && (!randomStartersSettings.MATCH_SIMILAR_BST || baseStatDifference(pokemon) <= randomStartersSettings.MATCH_SIMILAR_BST.THRESHOLD)
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
  
  const itemsSettings = settings.ITEMS
  
  // Starting Inventory
  
  const startingInventorySettings = itemsSettings.STARTING_INVENTORY
  
  let hasStartingInventory = false
  let pokedexPartsValue = 0
  let pokegearPartsValue = 0
  let johtoBadgesValue = 0
  let kantoBadgesValue = 0
  const bagItemValues: {itemId: string, itemAmount: string}[] = []
    
  Object.values(itemCategoriesMap).forEach((category) => {
    const itemCategorySettings = startingInventorySettings[category.id]
    
    const itemAmountMap = itemCategorySettings.reduce((result: Partial<Record<ItemId, number>>, setting) => {
      let mappedSetting: Partial<Record<ItemId, number>>
      
      if (isString(setting)) {
        mappedSetting = {
          [setting]: 1,
        }
      } else {
        mappedSetting = Object.entries(setting).reduce((result, [itemId, settings]) => {
          return {
            ...result,
            [itemId]: settings.AMOUNT,
          }
        }, {})
      }
      
      return {
        ...result,
        ...mappedSetting,
      }
    }, {})
    
    Object.entries(itemAmountMap).forEach(([itemId, amount]) => {
      hasStartingInventory = true
      
      const item = itemsMap[itemId as ItemId]
          
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
          itemAmount: `[2]{${amount}}`,
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
        pokedexParts: hexStringFrom(bytesFrom(pokedexPartsValue, 1)),
        pokegearParts: hexStringFrom(bytesFrom(pokegearPartsValue, 1)),
        johtoBadges: hexStringFrom(bytesFrom(johtoBadgesValue, 1)),
        kantoBadges: hexStringFrom(bytesFrom(kantoBadgesValue, 1)),
      }
    )
  
    hunks = [...hunks, ...startingItemsPatch.hunks]
  }
  
  // Other
  
  const otherSettings = settings.OTHER
  
  // Skip Gender
  
  if (otherSettings.SKIP_GENDER) {
    const genderId = playerSpriteMap[otherSettings.SKIP_GENDER.PLAYER_SPRITE].numericId
    const skipGenderPatch = Patch.fromYAML(
      romInfo,
      "skipGender.yml",
      {},
      {
        genderId: hexStringFrom(bytesFrom(genderId, 1)),
      }
    )
  
    hunks = [...hunks, ...skipGenderPatch.hunks]
  }
  
  // Skip Name
  
  if (otherSettings.SKIP_NAME) {
    const nameBytes = ROMInfo.displayCharacterBytesFrom(otherSettings.SKIP_NAME.PLAYER_NAME)
    const skipNamePatch = Patch.fromYAML(
      romInfo,
      "skipName.yml",
      {},
      {
        name: hexStringFrom(nameBytes),
      }
    )
  
    hunks = [...hunks, ...skipNamePatch.hunks]
  }
  
  // Additional Options
  
  const selectedAdditionalOptionIds = otherSettings.ADDITIONAL_OPTIONS
  
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
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion())),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue)),
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