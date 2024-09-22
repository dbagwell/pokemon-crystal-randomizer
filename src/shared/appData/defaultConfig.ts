import { wildEncounterAvailabilityOptions } from "@shared/appData/wildEncounterAvailability"
import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsGroupedByCategory } from "@shared/gameData/itemHeplers"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import type { AdditionalOptionId } from "@shared/types/gameDataIds/additionalOptions"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"
import { itemCategoryIds } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"
import { type MoveId, moveIds } from "@shared/types/gameDataIds/moves"
import type { OddEggOptionId } from "@shared/types/gameDataIds/oddEggOptions"
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
          RANDOMIZE_EVENT_POKEMON: {
            label: "Randomize Event Pokémon",
            description: "Makes it so the Pokémon encountered or gifted during special events are randomized.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              UNIQUE: {
                label: "Unique",
                description: "Ensures all event Pokémon are different.",
                type: "ToggleInput" as const,
                value: false,
              },
              ODD_EGG: {
                label: "Odd Egg Behaviour",
                description: "Adds restrictions to the 14 different outcomes for the Odd Egg.",
                type: "SelectorInput" as const,
                options: [
                  {
                    id: "RANDOM",
                    label: "All Random",
                    description: "All 14 options are randomized separately.",
                  },
                  {
                    id: "SHINY_MATCH",
                    label: "Shiny Match",
                    description: "The 7 shiny options will match their non-shiny counterparts.",
                  },
                  {
                    id: "SAME",
                    label: "All Same",
                    description: "All 14 options will be the same Pokémon.",
                  },
                ],
                multiselect: false as const,
                required: true as const,
                value: "RANDOM" as OddEggOptionId,
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
          RANDOMIZE_WILD_ENCOUNTERS: {
            label: "Randomize Wild Encounters",
            description: "Changes the Pokémon that can be encountered in tall grass, surfing on water, fishing, in trees and in rocks.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              AVAILABILITY: {
                label: "Availability",
                description: "Modifies how many species are available in the wild and where they can be found.",
                type: "SelectorInput" as const,
                options: wildEncounterAvailabilityOptions,
                multiselect: false as const,
                required: true as const,
                value: "RANDOM" as typeof wildEncounterAvailabilityOptions[number]["id"],
              },
              REMOVE_TIME_BASED_ENCOUNTERS: {
                label: "Remove Time Based Encounters",
                description: "Makes it so the Pokémon found in a certain area are the same regardless of the time of day.",
                type: "ToggleInput" as const,
                value: false,
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
          WILD_ENCOUNTER_RATES: {
            label: "Wild Encounter Rates",
            description: "Randomizes which TMs each Pokémon can learn from.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            subElementConfigs: {
              LAND: {
                label: "Land Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  30,
                  30,
                  20,
                  10,
                  5,
                  4,
                  1,
                ],
              },
              WATER: {
                label: "Water Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  60,
                  30,
                  10,
                ],
              },
              OLD_ROD: {
                label: "Old Rod Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  70,
                  15,
                  15,
                ],
              },
              GOOD_ROD: {
                label: "Good Rod Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  35,
                  35,
                  20,
                  10,
                ],
              },
              SUPER_ROD: {
                label: "Super Rod Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  40,
                  30,
                  20,
                  10,
                ],
              },
              TREE: {
                label: "Tree Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  50,
                  15,
                  15,
                  10,
                  5,
                  5,
                ],
              },
              ROCK: {
                label: "Rock Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  90,
                  10,
                ],
              },
              CONTEST: {
                label: "Contest Encounter Rates",
                type: "IntegerGroupInput" as const,
                min: 0,
                max: 100,
                sum: 100,
                values: [
                  20,
                  20,
                  10,
                  10,
                  5,
                  5,
                  10,
                  10,
                  5,
                  5,
                ],
              },
            },
          },
          INCREASE_POKEMON_CATCH_RATES: {
            label: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. At 100%, all Pokémon are as likely to be caught as Rattata.",
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
            },
          },
          STANDARDIZE_POKEMON_GROWTH_RATES: {
            label: "Standardize Pokémon Growth Rates",
            description: "Makes it so that all Pokémon require the same amount of experience for each level.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              GROWTH_RATE: {
                label: "Growth Rate",
                description: "Determines how much experience is required for each level.",
                type: "SelectorInput" as const,
                options: Object.values(growthRatesMap).map((growthRate) => {
                  return {
                    id: growthRate.id,
                    label: growthRate.name,
                  }
                }),
                multiselect: false as const,
                required: true as const,
                value: "MEDIUM_FAST" as GrowthRateId,
              },
              EXCLUDE: {
                label: "Exclude",
                description: "These Pokémon will keep their vanilla growth rates.",
                type: "SelectorInput" as const,
                options: pokemonOptions,
                multiselect: true as const,
                selectedOptionIds: [] as PokemonId[],
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
                description: "Guarantees that the specified percentage of each Pokémon's moveset are damaging moves of at least the specified power, unless doing so would conflict with other settings. If there is a conflict, as many good moves as possible will be selected.",
                type: "FormSection" as const,
                layout: "horizontal" as const,
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
                    max: 250,
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
          RANDOMIZE_TM_COMPATIBILITY: {
            label: "Randomize TM Compatibility",
            description: "Randomizes which TMs each Pokémon can learn from.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              PERCENTAGE: {
                label: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the TMs.",
                type: "IntegerInput" as const,
                required: false as const,
                min: 0,
                max: 100,
                value: undefined,
              },
            },
          },
          RANDOMIZE_HM_COMPATIBILITY: {
            label: "Randomize HM Compatibility",
            description: "Randomizes which HMs each Pokémon can learn from.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              PERCENTAGE: {
                label: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the HMs.",
                type: "IntegerInput" as const,
                required: false as const,
                min: 0,
                max: 100,
                value: undefined,
              },
            },
          },
          RANDOMIZE_MOVE_TUTOR_COMPATIBILITY: {
            label: "Randomize Move Tutor Compatibility",
            description: "Randomizes which Move Tutor moves each Pokémon can learn.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              PERCENTAGE: {
                label: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the Move Tutor moves.",
                type: "IntegerInput" as const,
                required: false as const,
                min: 0,
                max: 100,
                value: undefined,
              },
            },
          },
          TRADES: {
            label: "Trades",
            type: "FormSection" as const,
            layout: "vertical" as const,
            subElementConfigs: {
              RANDOMIZE_TRADE_ASKS: {
                label: "Randomize Trade Asks",
                description: "Randomizes the Pokémon asked for in trades.",
                type: "ToggleInput" as const,
                value: false,
              },
              RANDOMIZE_TRADE_OFFERS: {
                label: "Randomize Trade Offers",
                description: "Randomizes the Pokémon offered for in trades.",
                type: "ToggleInput" as const,
                value: false,
              },
              UNIQUE: {
                label: "Unique",
                description: "Make sure all trade Pokémon are all different.",
                type: "ToggleInput" as const,
                value: false,
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
      MOVES: {
        label: "Moves",
        type: "FormSection" as const,
        layout: "vertical" as const,
        subElementConfigs: {
          RANDOMIZE_TMS: {
            label: "Randomize TMs",
            description: "Randomize the moves that each TM teaches.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              UNIQUE: {
                label: "Unique",
                description: "Make sure that each TM teaches a different move.",
                type: "ToggleInput" as const,
                value: false,
              },
              PREFER_SAME_TYPE: {
                label: "Prefer Same Type",
                description: "Limit the randomization options to moves of the same type.",
                type: "ToggleInput" as const,
                value: false,
              },
              KEEP_FIELD_MOVES: {
                label: "Keep Field Moves",
                description: "Don't randomize TM02 (Headbutt), TM08 (Rock Smash), TM12 (Sweet Scent) or TM28 (Dig).",
                type: "ToggleInput" as const,
                value: false,
              },
              GOOD_DAMAGING_MOVES: {
                label: "Guarantee Percentage of Good Damaging Moves",
                description: "Guarantees that the specified percentage of all TMs are damaging moves of at least the specified power, unless doing so would conflict with other settings. If there is a conflict, as many good moves as possible will be selected.",
                type: "FormSection" as const,
                layout: "horizontal" as const,
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
                    max: 250,
                    value: 0,
                  },
                },
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
          RANDOMIZE_MOVE_TUTORS: {
            label: "Randomize Move Tutor Moves",
            description: "Randomize the moves that the move tutor can teach.",
            type: "FormSection" as const,
            layout: "vertical" as const,
            hasToggle: true as const,
            toggleValue: false,
            subElementConfigs: {
              UNIQUE: {
                label: "Unique",
                description: "Make sure that each move is different.",
                type: "ToggleInput" as const,
                value: false,
              },
              PREFER_SAME_TYPE: {
                label: "Prefer Same Type",
                description: "Limit the randomization options to moves of the same type.",
                type: "ToggleInput" as const,
                value: false,
              },
              GOOD_DAMAGING_MOVES: {
                label: "Guarantee Percentage of Good Damaging Moves",
                description: "Guarantees that the specified percentage of all Move Tutor moves are damaging moves of at least the specified power, unless doing so would conflict with other settings. If there is a conflict, as many good moves as possible will be selected.",
                type: "FormSection" as const,
                layout: "horizontal" as const,
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
                    max: 250,
                    value: 0,
                  },
                },
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
          POKE_BALLS_NEVER_FAIL: {
            label: "Poké Balls Never Fail",
            description: "All Poké Balls are guaranteed to work.",
            type: "ToggleInput" as const,
            value: false,
          },
          PREVENT_FAILED_POKE_BALL_WOBBLES: {
            label: "Prevent Failed Poké Ball Wobbles",
            description: "If a Poké Ball fails to catch a Pokémon, don't show any shake animations.",
            type: "ToggleInput" as const,
            value: false,
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
                required: true as const,
                maxCharacters: 7,
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