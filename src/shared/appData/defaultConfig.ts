import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsGroupedByCategory } from "@shared/gameData/itemHeplers"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { AdditionalOptionId } from "@shared/types/gameDataIds/additionalOptions"
import { itemCategoryIds } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"
import { type MoveId, moveIds } from "@shared/types/gameDataIds/moves"
import { type PlayerSpriteId, playerSpriteIds } from "@shared/types/gameDataIds/playerSprites"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { mapToRecord } from "@shared/utils"

const pokemonOptions = pokemonIds.map((pokemonId) => {
  return {
    id: pokemonId,
    label: pokemonMap[pokemonId].name,
  }
})

export const defaultConfig = () => {
  return {
    label: "Settings",
    type: "FormSection" as const,
    layout: "vertical" as const,
    subElementConfigs: {
      POKEMON: {
        label: "Pokémon",
        type: "FormSection" as const,
        layout: "vertical" as const,
        subElementConfigs: {
          STARTERS: {
            label: "Starters",
            type: "FormSection" as const,
            layout: "vertical" as const,
            subElementConfigs: {
              CUSTOM: {
                label: "Custom",
                description: "Select specific Pokémon for specific starter locations. For each selection, any randomization of that starter will be skipped.",
                type: "FormSection" as const,
                layout: "horizontal" as const,
                subElementConfigs: mapToRecord(starterLocationIds, (locationId) => {
                  return {
                    label: starterLocationsMap[locationId].name,
                    type: "SelectorInput" as const,
                    options: pokemonOptions,
                    multiselect: false as const,
                    value: undefined as PokemonId | undefined,
                  }
                }),
              },
              RANDOM: {
                label: "Random",
                description: "Change the starter Pokémon to random ones.",
                type: "FormSection" as const,
                layout: "vertical" as const,
                hasToggle: true as const,
                toggleValue: false,
                subElementConfigs: {
                  UNIQUE: {
                    label: "Unique",
                    description: "Ensures all three starters are different Pokémon.",
                    type: "ToggleInput" as const,
                    value: false,
                  },
                  MATCH_TYPE: {
                    label: "Match Type",
                    description: "Limit the randomization options for each starter to Pokémon that share a type with the Vanilla starter.",
                    type: "ToggleInput" as const,
                    value: false,
                  },
                  MATCH_STAGE: {
                    label: "Match Stage",
                    description: "Limit the randomization options to Pokémon that don't have pre-evolutions.",
                    type: "ToggleInput" as const,
                    value: false,
                  },
                  MATCH_EVOLUTIONS: {
                    label: "Match Evolutions",
                    description: "Limit the randomization options to Pokémon that can evolve twice.",
                    type: "ToggleInput" as const,
                    value: false,
                  },
                  MATCH_SIMILAR_BST: {
                    label: "Match Similar Base Stat Total",
                    description: "Limit the randomization options to Pokémon whose Base Stat Total is within a certain threshold of the Vanilla starter's.",
                    type: "FormSection" as const,
                    layout: "vertical" as const,
                    hasToggle: true as const,
                    toggleValue: false,
                    subElementConfigs: {
                      THRESHOLD: {
                        label: "Threshold",
                        type: "IntegerInput" as const,
                        required: true as const,
                        min: 0,
                        max: 371,
                        value: 50,
                      },
                    },
                  },
                  BAN: {
                    label: "Ban",
                    description: "Prevent these Pokémon from being selected by the randomizer.",
                    type: "SelectorInput" as const,
                    options: pokemonOptions,
                    multiselect: true as const,
                    selectedOptionIds: [] as PokemonId[],
                  },
                },
              },
            },
          },
          RANDOMIZE_LEVEL_UP_MOVES: {
            label: "Randomize Level Up Moves",
            description: "Change moves Pokémon can learn by level up to random ones.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              UNIQUE: {
                label: "Unique",
                description: "Make sure that Pokémon can't learn the same move by level up more than once.",
                type: "ToggleInput" as const,
                value: false,
              },
              PREFER_SAME_TYPE: {
                label: "Prefer Same Type",
                description: "Limit the randomization options to moves of the same type.",
                type: "ToggleInput" as const,
                value: false,
              },
              PROGRESSIVE: {
                label: "Reorder Damaging Moves",
                description: "Reorders the moves after randomization so that damaging moves with more power are learned after damaging moves with less power.",
                type: "ToggleInput" as const,
                value: false,
              },
              GOOD_DAMAGING_MOVES: {
                label: "Guarantee Percentage of Good Damaging Moves",
                description: "Guarantees that the specified percentage of each Pokémon's moveset are damaging moves of at least the specified power, unless doing so would confilct with other settings. If there is a conflict, as many good moves as possible will be selected.",
                type: "FormSection" as const,
                layout: "vertical" as const,
                hasToggle: true as const,
                toggleValue: false,
                subElementConfigs: {
                  PERCENTAGE: {
                    label: "Percentage",
                    type: "IntegerInput" as const,
                    required: true as const,
                    min: 0,
                    max: 100,
                    value: 0,
                  },
                  POWER: {
                    label: "Power",
                    type: "IntegerInput" as const,
                    required: true as const,
                    min: 0,
                    max: 150,
                    value: 0,
                  },
                },
              },
              LEVEL_ONE_MOVES: {
                label: "Guaranteed Number of Level 1 Moves",
                description: "Adds level 1 moves to a Pokémon's level up moves if they normally have less than the specified number.",
                type: "IntegerInput" as const,
                required: true as const,
                min: 1,
                max: 4,
                value: 1,
              },
              BAN: {
                label: "Ban",
                description: "Prevent these moves from being selected by the randomizer.",
                type: "SelectorInput" as const,
                options: moveIds.map((moveId) => {
                  return {
                    id: moveId,
                    label: movesMap[moveId].name,
                  }
                }),
                multiselect: true as const,
                selectedOptionIds: [] as MoveId[],
              },
            },
          },
        },
      },
      ITEMS: {
        label: "Items",
        type: "FormSection" as const,
        layout: "vertical" as const,
        subElementConfigs: {
          STARTING_INVENTORY: {
            label: "Starting Items",
            description: "Items to start the game with.",
            type: "FormSection" as const,
            layout: "horizontal" as const,
            subElementConfigs: mapToRecord(itemCategoryIds, (categoryId) => {
              const category = itemCategoriesMap[categoryId]
              return {
                label: category.name,
                type: "SelectorInput" as const,
                options: itemsGroupedByCategory[categoryId]!.map((item) => {
                  return {
                    id: item.id,
                    label: item.name,
                    subElementConfigs: category.slotSize > 1 ? {
                      AMOUNT: {
                        label: "Amount",
                        type: "IntegerInput" as const,
                        min: 1,
                        max: category.slotSize,
                        required: true as const,
                        value: 1,
                      },
                    } : undefined,
                  }
                }),
                multiselect: true as const,
                maxSelections: category.maxSlots,
                selectedOptionIds: [] as ItemId[],
              }
            }),
          },
        },
      },
      OTHER: {
        label: "Other",
        type: "FormSection" as const,
        layout: "vertical" as const,
        subElementConfigs: {
          SKIP_GENDER: {
            label: "Use Preset Gender",
            description: "Skips the gender selection dialog when stating a new game.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              PLAYER_SPRITE: {
                label: "Player Sprite",
                description: "Sets the player sprite to the selected value when starting a new game.",
                type: "SelectorInput" as const,
                options: playerSpriteIds.map((id) => {
                  return {
                    id: id,
                    label: playerSpriteMap[id].label,
                  }
                }),
                multiselect: false as const,
                required: true as const,
                value: playerSpriteMap.GIRL.id as PlayerSpriteId,
              },
            },
          },
          SKIP_NAME: {
            label: "Use Preset Name",
            description: "Skips the name selection prompt when stating a new game.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              PLAYER_NAME: {
                label: "Player Name",
                description: "Sets the player name to the provided value when starting a new game. Max of 7 characters. Supported special characters include ():;[]<>-?!.×/, where < and > map to PK and MN respectively.",
                type: "TextInput" as const,
                required: true as const, // TODO: We need to support this
                maxCharacters: 7, // TODO: We need to support this
                value: "KRIS",
              },
            },
          },
          BIKE_ANYWHERE: {
            label: "Bike Anywhere",
            description: "Allows the player to bike anywhere.",
            type: "ToggleInput" as const,
            value: false,
          },
          IMPROVE_PERFORMANCE: {
            label: "Add Performance Improvements",
            description: "Adds general performance improvements to the game, like removing lag when performing certain actions.",
            type: "ToggleInput" as const,
            value: false,
          },
          ADDITIONAL_OPTIONS: {
            label: "Additional Options",
            description: "Extra settings that are added to the in game options menu.",
            type: "SelectorInput" as const,
            options: Object.values(additionalOptionsMap).map((option) => {
              return {
                id: option.id,
                label: option.name,
                description: option.description,
              }
            }),
            multiselect: true as const,
            selectedOptionIds: [] as AdditionalOptionId[],
          },
        },
      },
    },
  }
}