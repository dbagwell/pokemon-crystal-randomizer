import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsGroupedByCategory } from "@shared/gameData/itemHeplers"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { AdditionalOptionId } from "@shared/types/gameDataIds/additionalOptions"
import { itemCategoryIds } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { mapToRecord } from "@shared/utils"

const pokemonOptions = Object.values(pokemonMap).map((pokemon) => {
  return {
    id: pokemon.id as PokemonId,
    label: pokemon.name,
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