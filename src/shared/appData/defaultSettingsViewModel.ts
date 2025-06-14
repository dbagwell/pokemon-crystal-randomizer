import { accessRulesetIds, accessRulsetsMap } from "@shared/appData/accessRulesets"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemLocationGroupsMap } from "@shared/gameData/itemLocationGroups"
import { itemLocationsMap } from "@shared/gameData/itemLocations"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { pokemonMap } from "@shared/gameData/pokemon"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import type { ItemCategory } from "@shared/types/gameData/itemCategory"
import { growthRateIds } from "@shared/types/gameDataIds/growthRates"
import { type ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import { itemLocationGroupIds } from "@shared/types/gameDataIds/itemLocationGroups"
import { itemLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { ballItemIds, holdableItemIds, type ItemId, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import {
  createConfigurableMultiSelectorViewModel,
  createConfigurableSelectorOption,
  createConfigurableToggleViewModel,
  createGroupMultiSelectorViewModel,
  createIntegerInputGroupViewModel,
  createIntegerInputViewModel,
  createIntegerRangeInputViewModel,
  createSimpleMultiSelectorViewModel,
  createSimpleSelectorOption,
  createSimpleToggleViewModel,
  createSingleSelectorViewModel,
  createTabViewModel,
} from "@shared/types/viewModels"

export const defaultSettingsViewModel = () => {
  return {
    selectedTabId: "POKEMON",
    tabViewModels: [
      createTabViewModel({
        id: "POKEMON" as const,
        name: "Pokémon",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "CHANGE_STARTERS" as const,
            name: "Change Starters",
            description: "Change the starter Pokémon choices offered by Prof. Elm at the start of the game.",
            viewModels: [
              createSingleSelectorViewModel({
                selectedOptionId: "RANDOM",
                id: "METHOD" as const,
                options: [
                  createConfigurableSelectorOption({
                    id: "RANDOM" as const,
                    name: "Random",
                    description: "Change the starter Pokémon to random ones.",
                    viewModels: [
                      createUniquePokemonSelectorViewModel(),
                      createSimpleToggleViewModel({
                        id: "MATCH_TYPE" as const,
                        name: "Match Type",
                        description: "Make sure each chosen starter Pokémon shares a type with the Pokémon it's replacing.",
                      }),
                      createSimpleToggleViewModel({
                        id: "MATCH_STAGE" as const,
                        name: "Match Stage",
                        description: "Make sure each chosen starter Pokémon doesn't have any pre-evolutions.",
                      }),
                      createSimpleToggleViewModel({
                        id: "MATCH_EVOLUTIONS" as const,
                        name: "Match Evolutions",
                        description: "Make sure each chosen starter Pokémon can evolve twice.",
                      }),
                      createConfigurableToggleViewModel({
                        id: "MATCH_SIMILAR_BST" as const,
                        name: "Match Similar BST",
                        description: "Make sure each chosen starter Pokémon's Base Stat Total is within a specified threshold of the Pokémon it's replacing.",
                        viewModels: [
                          createIntegerInputViewModel({
                            id: "THRESHOLD" as const,
                            name: "Threshold",
                            isRequired: true as const,
                            min: 0,
                            max: 371,
                            value: 50,
                          }),
                        ] as const,
                      }), // END MATCH_SIMILAR_BST
                      createBannedPokemonSelectorViewModel(),
                    ] as const,
                  }), // END RANDOM
                  createConfigurableSelectorOption({
                    id: "CUSTOM" as const,
                    name: "Custom",
                    description: "Set a specific Pokémon for each starter.",
                    viewModels: [
                      createSingleSelectorViewModel({
                        id: "LEFT" as const,
                        name: "Left",
                        description: "The Pokémon to set as the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "CYNDAQUIL",
                        options: pokemonIds.map((pokemonId) => {
                          return createSimpleSelectorOption({
                            id: pokemonId,
                            name: pokemonMap[pokemonId].name,
                          })
                        }),
                      }), // END LEFT
                      createSingleSelectorViewModel({
                        id: "MIDDLE" as const,
                        name: "Middle",
                        description: "The Pokémon to set as the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "TOTODILE",
                        options: pokemonIds.map((pokemonId) => {
                          return createSimpleSelectorOption({
                            id: pokemonId,
                            name: pokemonMap[pokemonId].name,
                          })
                        }),
                      }), // END MIDDLE
                      createSingleSelectorViewModel({
                        id: "RIGHT" as const,
                        name: "Right",
                        description: "The Pokémon to set as the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "CHIKORITA",
                        options: pokemonIds.map((pokemonId) => {
                          return createSimpleSelectorOption({
                            id: pokemonId,
                            name: pokemonMap[pokemonId].name,
                          })
                        }),
                      }), // END RIGHT
                    ] as const,
                  }), // END CUSTOM
                ] as const,
              }),
              createSimpleToggleViewModel({
                id: "CHANGE_RIVALS_STARTER" as const,
                name: "Also Change Rival's Starter",
                description: "Change the Pokémon on the Rival's Pokémon teams to match the Pokémon that appears to be stolen from Prof. Elm's Lab.",
              }),
            ] as const,
          }), // END CHANGE_STARTERS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_EVENT_POKEMON" as const,
            name: "Randomize Event Pokémon",
            description: "Changes the Pokémon encountered or gifted during special events to random Pokémon.",
            viewModels: [
              createUniquePokemonSelectorViewModel(),
              createSingleSelectorViewModel({
                id: "ODD_EGG" as const,
                name: "Odd Egg Variation",
                description: "Determines how many different Pokémon the Odd Egg could hatch into.",
                selectedOptionId: "RANDOM",
                options: [
                  createSimpleSelectorOption({
                    id: "RANDOM" as const,
                    name: "All Random",
                    description: "All 14 options are randomized separately.",
                  }),
                  createSimpleSelectorOption({
                    id: "SHINY_MATCH" as const,
                    name: "Shiny Match",
                    description: "The 7 shiny options will match their non-shiny counterparts.",
                  }),
                  createSimpleSelectorOption({
                    id: "SAME" as const,
                    name: "All Same",
                    description: "All 14 options will be the same Pokémon.",
                  }),
                ] as const,
              }), // END ODD_EGG
              createBannedPokemonSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_EVENT_POKEMON
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_RANDOM_ENCOUNTERS" as const,
            name: "Randomize Random Pokémon Encounters",
            description: "Change the Pokémon that randomly encountered in the grass, on the water, "
              + "in Headbutt trees, under Rock Smash rocks and from fishing to random Pokémon.\n\n"
              + "IMPORTANT: If this is enabled and the 'Randomize HM Compatibility' setting is not enabled with a 'Percentage' of 100%, "
              + "the generated ROM may be unbeatable due to not having access to Pokémon that can learn the HMs required to progress the game.",
            viewModels: [
              createSimpleToggleViewModel({
                id: "REMOVE_TIME_BASED_ENCOUNTERS" as const,
                name: "Remove Time Based Encounters",
                description: "Makes it so that the Pokémon encountered in a specific area are the same regardless of the time of day.",
              }),
              createConfigurableToggleViewModel({
                id: "FORCE_FULLY_EVOLVED_BELOW_LEVEL" as const,
                name: "Force Fully Evolved Below Level",
                description: "Ensure all selected Pokémon below the specified level are fully evolved.",
                viewModels: [
                  createIntegerInputViewModel({
                    id: "THRESHOLD" as const,
                    name: "Threshold",
                    isRequired: true as const,
                    min: 1,
                    max: 100,
                    value: 10,
                  }),
                ] as const,
              }), // END FORCE_FULLY_EVOLVED_BELOW_LEVEL
              createSingleSelectorViewModel({
                id: "AVAILABILITY" as const,
                name: "Availability",
                description: "Rules for determining which Pokémon are available and where they can be found.",
                selectedOptionId: "RANDOM",
                options: [
                  createSimpleSelectorOption({
                    id: "RANDOM" as const,
                    name: "No Guarantee",
                    description: "All random encounters are selected entirely at random. Some Pokémon might not be available as wild encounter.",
                  }),
                  createSimpleSelectorOption({
                    id: "FULL" as const,
                    name: "Full",
                    description: "All species of Pokémon that aren't banned are guaranteed to exist as at least one wild encounter, unless too many slots are forced to be fully evolved.",
                  }),
                  createSimpleSelectorOption({
                    id: "SEARCHABLE" as const,
                    name: "Pokédex Searchable",
                    description: "All species of Pokémon that aren't banned are guaranteed to exist as at least one wild encounter that is visible in the Pokédex (in the tall grass, in caves, or on the water), unless too many slots are forced to be fully evolved.",
                  }),
                  createSimpleSelectorOption({
                    id: "REGIONAL" as const,
                    name: "Regional",
                    description: "Same as 'Pokédex Searchable', but the rules are applied to each region separately.",
                  }),
                ] as const,
              }), // END AVAILABILITY
              createBannedPokemonSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_RANDOM_ENCOUNTERS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TRADES" as const,
            name: "Randomize Trades",
            description: "Randomize the Pokémon requested and offered in the in-game trades.",
            viewModels: [
              createSingleSelectorViewModel({
                id: "METHOD" as const,
                selectedOptionId: "BOTH",
                options: [
                  createSimpleSelectorOption({
                    id: "BOTH" as const,
                    name: "Both",
                    description: "Randomize both the Pokémon being requested and the Pokémon being offered in the trade.",
                  }),
                  createSimpleSelectorOption({
                    id: "REQUEST_ONLY" as const,
                    name: "Request Only",
                    description: "Randomize only the Pokémon being requested in the trade.",
                  }),
                  createSimpleSelectorOption({
                    id: "OFFER_ONLY" as const,
                    name: "Offer Only",
                    description: "Randomize only the Pokémon being offered in the trade.",
                  }),
                ] as const,
              }), // END METHOD
              createUniquePokemonSelectorViewModel(),
              createConfigurableToggleViewModel({
                id: "CHANGE_REQUESTED_GENDERS" as const,
                name: "Change Requested Genders",
                description: "Changes the preferred gender of requested trade Pokémon.",
                viewModels: [
                  createSingleSelectorViewModel({
                    id: "METHOD" as const,
                    selectedOptionId: "NONE",
                    options: [
                      createSimpleSelectorOption({
                        id: "NONE" as const,
                        name: "None",
                        description: "Makes it so all trade requests have no gender preferences.",
                      }),
                      createSimpleSelectorOption({
                        id: "MALE" as const,
                        name: "Male",
                        description: "Makes it so all requested trade Pokémon are male.",
                      }),
                      createSimpleSelectorOption({
                        id: "FEMALE" as const,
                        name: "Female",
                        description: "Makes it so all requested trade Pokémon are female.",
                      }),
                      createSimpleSelectorOption({
                        id: "RANDOM" as const,
                        name: "Random",
                        description: "Makes it so the preferred gender of each requested trade Pokémon is random.",
                      }),
                    ] as const,
                  }),
                ] as const,
              }),
              createBannedPokemonSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_TRADES
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TRAINER_POKEMON" as const,
            name: "Randomize Trainer Pokémon",
            description: "Randomize the Pokémon used by other trainers in battle.",
            viewModels: [
              createSimpleToggleViewModel({
                id: "TYPE_THEME_TEAMS" as const,
                name: "Type Theme Teams",
                description: "Ensure all Pokémon on each Trainer's team share at least one common type.",
              }),
              createConfigurableToggleViewModel({
                id: "FORCE_FULLY_EVOLVED_ABOVE_LEVEL" as const,
                name: "Force Fully Evolved Above Level",
                description: "Ensure all selected Pokémon above the specified level are fully evolved.",
                viewModels: [
                  createIntegerInputViewModel({
                    id: "THRESHOLD" as const,
                    name: "Threshold",
                    isRequired: true as const,
                    min: 1,
                    max: 100,
                    value: 49,
                  }),
                ] as const,
              }), // END FORCE_FULLY_EVOLVED_ABOVE_LEVEL
              createSimpleToggleViewModel({
                id: "INGORE_RIVALS_STARTER" as const,
                name: "Ignore Rival's Starter",
                description: "Don't randomize the last Pokémon on each of the Rival's teams "
                  + "so that it still appears as though they are keeping that Pokémon with them throughout the game. "
                  + "And so that it doesn't get changed again if it was already changed to match the random or custom starter Pokémon.",
              }),
              createBannedPokemonSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_TRAINER_POKEMON
          createSimpleToggleViewModel({
            id: "RANDOMIZE_INTRO_POKEMON" as const,
            name: "Randomize Intro Pokémon",
            description: "Randomizes the Pokémon shown by Prof. Oak during the game's introduction.",
          }),
          createSimpleMultiSelectorViewModel({
            id: "BANNED_POKEMON" as const,
            name: "Globally Banned Pokémon",
            description: "A list of Pokémon to always exclude when choosing random Pokémon.",
            options: pokemonIds.map((pokemonId) => {
              return createSimpleSelectorOption({
                id: pokemonId,
                name: pokemonMap[pokemonId].name,
              })
            }),
          }), // END BANNED_POKEMON
        ] as const,
      }), // END POKEMON
      createTabViewModel({
        id: "POKEMON_PROPERTIES" as const,
        name: "Pokémon Properties",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "CHANGE_POKEMON_ENCOUNTER_RATIOS" as const,
            name: "Change Pokémon Encounter Ratios",
            description: "Change the relative chances of encountering each Pokémon in a specific area and with a specific method. "
              + "Values are the percent chance of encountering the Pokémon assigned to that slot index "
              + "when a random encounter occurs. Each set of ratios must add up to 100.",
            viewModels: [
              createIntegerInputGroupViewModel({
                id: "GRASS_AND_CAVES" as const,
                name: "Grass and Caves",
                min: 0,
                max: 100,
                sum: 100,
                values: [30, 30, 20, 10, 5, 4, 1],
              }),
              createIntegerInputGroupViewModel({
                id: "WATER" as const,
                name: "Water",
                min: 0,
                max: 100,
                sum: 100,
                values: [60, 30, 10],
              }),
              createIntegerInputGroupViewModel({
                id: "OLD_ROD" as const,
                name: "Old Rod",
                min: 0,
                max: 100,
                sum: 100,
                values: [70, 15, 15],
              }),
              createIntegerInputGroupViewModel({
                id: "GOOD_ROD" as const,
                name: "Good Rod",
                min: 0,
                max: 100,
                sum: 100,
                values: [35, 35, 20, 10],
              }),
              createIntegerInputGroupViewModel({
                id: "SUPER_ROD" as const,
                name: "Super Rod",
                min: 0,
                max: 100,
                sum: 100,
                values: [40, 30, 20, 10],
              }),
              createIntegerInputGroupViewModel({
                id: "TREE" as const,
                name: "Headbutt Trees",
                min: 0,
                max: 100,
                sum: 100,
                values: [50, 15, 15, 10, 5, 5],
              }),
              createIntegerInputGroupViewModel({
                id: "ROCK" as const,
                name: "Rock Smash Rocks",
                min: 0,
                max: 100,
                sum: 100,
                values: [90, 10],
              }),
              createIntegerInputGroupViewModel({
                id: "CONTEST" as const,
                name: "Bug Catching Contest",
                min: 0,
                max: 100,
                sum: 100,
                values: [20, 20, 10, 10, 5, 5, 10, 10, 5, 5],
              }),
            ] as const,
          }), // END CHANGE_POKEMON_ENCOUNTER_RATIOS
          createSimpleToggleViewModel({
            id: "RANDOM_SHINY_ENCOUNTER_ATTACK_STAT" as const,
            name: "Random Shiny Encounter Attack Stat",
            description: "Makes it so the Determinant Value (DV) of the Attack Stat of the Shiny Pokémon in the Lake of Rage "
              + "is randomly selected when the battle starts instead of always being 14.\n"
              + "The possible values are still limited to ones that allow the Pokémon to be shiny (2, 3, 6, 7, 10, 11, 14, 15).",
          }),
          createSimpleToggleViewModel({
            id: "RANDOMIZE_TRADE_POKEMON_STATS" as const,
            name: "Randomize Trade Pokémon Stats",
            description: "Changes the Determinant Values (DVs) of the Pokémon received from trades to random ones.",
          }),
          createSimpleToggleViewModel({
            id: "PREVENT_WILD_POKEMON_FLEEING" as const,
            name: "Prevent Wild Pokémon from Fleeing",
            description: "Makes it so that all Pokémon cannot flee from wild battles without the use of a fleeing move.",
          }),
          createConfigurableToggleViewModel({
            id: "INCREASE_POKEMON_CATCH_RATES" as const,
            name: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. "
              + "Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. "
              + "At 100%, all Pokémon are as likely to be caught as Rattata.",
            viewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                isRequired: true as const,
                min: 0,
                max: 100,
                value: 100,
              }),
            ] as const,
          }), // END INCREASE_POKEMON_CATCH_RATES
          createConfigurableToggleViewModel({
            id: "STANDARDIZE_POKEMON_GROWTH_RATES" as const,
            name: "Standardize Pokémon Growth Rates",
            description: "Makes it so that all Pokémon require the same amount of experience for each level.",
            viewModels: [
              createSingleSelectorViewModel({
                id: "GROWTH_RATE" as const,
                name: "Growth Rate",
                description: "Determines how much experience is required for each level.",
                selectedOptionId: "MEDIUM_FAST",
                options: growthRateIds.map((growthRateId) => {
                  return createSimpleSelectorOption({
                    id: growthRateId,
                    name: growthRatesMap[growthRateId].name,
                  })
                }),
              }), // END GROWTH_RATE
              createSimpleMultiSelectorViewModel({
                id: "EXCLUDE" as const,
                name: "Exclude",
                description: "A list of Pokémon that should keep their 'vanilla' growth rates.",
                options: pokemonIds.map((pokemonId) => {
                  return createSimpleSelectorOption({
                    id: pokemonId,
                    name: pokemonMap[pokemonId].name,
                  })
                }),
              }), // END EXCLUDE
            ] as const,
          }), // END STANDARDIZE_POKEMON_GROWTH_RATES
          createSimpleToggleViewModel({
            id: "USE_UPDATED_BASE_EXP" as const,
            name: "Use Updated Base Experience",
            description: "Changes the base experience that Pokémon give out when they are defeated "
              + "to the new amounts that have been used in official Pokémon games since Pokémon Black Version and Pokémon White Version.",
          }),
          createSimpleToggleViewModel({
            id: "FAST_BREEDING" as const,
            name: "Fast Breeding",
            description: "Makes eggs guaranteed to appear after only one breeding cycle between two compatible Pokémon.",
          }),
          createSimpleToggleViewModel({
            id: "FAST_HATCHING" as const,
            name: "Fast Hatching",
            description: "Makes all eggs hatch after only one hatch cycle.",
          }),
          createConfigurableToggleViewModel({
            id: "DECREASE_HIGH_EVOLUTION_LEVELS" as const,
            name: "Decrease High Evolution Levels",
            description: "Change the level at which Pokémon evolve if it is higher than the specified threshold.",
            viewModels: [
              createIntegerInputViewModel({
                id: "FIRST_EVOLUTION_THRESHOLD" as const,
                name: "Max First Evolution Level",
                description: "The maximum evolution level for Pokémon that don't have a pre-evolution.",
                isRequired: true as const,
                min: 1,
                max: 100,
                value: 30,
              }),
              createIntegerInputViewModel({
                id: "SECOND_EVOLUTION_THRESHOLD" as const,
                name: "Max Second Evolution Level",
                description: "The maximum evolution level for Pokémon that have already evolved.",
                isRequired: true as const,
                min: 1,
                max: 100,
                value: 40,
              }),
            ] as const,
          }), // END DECREASE_HIGH_EVOLUTION_LEVELS
          createConfigurableToggleViewModel({
            id: "CHANGE_TRADE_EVOLUTION_METHODS" as const,
            name: "Change Trade Evolution Methods",
            description: "Change the Pokémon that evolve by trading to evolve by level instead "
              + "(or by Water Stone in the case of Slowpoke into Slowking).",
            viewModels: [
              createIntegerInputViewModel({
                id: "FIRST_EVOLUTION_LEVEL" as const,
                name: "First Evolution Level",
                description: "The evolution level for trade evolution Pokémon that don't have a pre-evolution.",
                isRequired: true as const,
                min: 1,
                max: 100,
                value: 30,
              }),
              createIntegerInputViewModel({
                id: "SECOND_EVOLUTION_LEVEL" as const,
                name: "Second Evolution Level",
                description: "The evolution level for trade evolution Pokémon have already evolved.",
                isRequired: true as const,
                min: 1,
                max: 100,
                value: 37,
              }),
            ] as const,
          }), // END CHANGE_TRADE_EVOLUTION_METHODS
          createSimpleToggleViewModel({
            id: "CHANGE_TIME_BASED_EVOLUTION_METHODS" as const,
            name: "Change Time Based Evolution Methods",
            description: "Changes Espeon and Umbreon to evolve using Sun and Moon stones respectively.",
          }),
          createConfigurableToggleViewModel({
            id: "CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT" as const,
            name: "Change Happiness Evolution Requirement",
            description: "Change the minimum happiness required to trigger a happiness evolution.",
            viewModels: [
              createIntegerInputViewModel({
                id: "MINIMUM_HAPPINESS" as const,
                name: "Minimum Happiness",
                isRequired: true as const,
                min: 0,
                max: 255,
                value: 0,
              }),
            ] as const,
          }), // END CHANGE_HAPPINESS_EVOLUTION_REQUIREMENT
          createConfigurableToggleViewModel({
            id: "CHANGE_HO_OH_LEVEL" as const,
            name: "Change Ho-oh Level",
            description: "Changes the level of the Pokémon at the top of Tin Tower.",
            viewModels: [
              createIntegerInputViewModel({
                id: "LEVEL" as const,
                name: "Level",
                isRequired: true as const,
                min: 2,
                max: 100,
                value: 40,
              }),
            ] as const,
          }), // END CHANGE_HO_OH_LEVEL
        ] as const,
      }), // END POKEMON_PROPERTIES
      createTabViewModel({
        id: "MOVES" as const,
        name: "Moves",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_LEVEL_UP_MOVES" as const,
            name: "Randomize Level Up Moves",
            description: "Change moves Pokémon can learn by level up to random ones.",
            viewModels: [
              createUniqueMovesSelectorViewModel("Ensures that each Pokémon cannot learn the same Move by level up more than once."),
              createPreferSameTypeMovesToggleViewModel(),
              createSimpleToggleViewModel({
                id: "PROGRESSIVE" as const,
                name: "Reorder Damaging Moves",
                description: "Reorders the moves after randomization so that damaging moves with more power are learned after damaging moves with less power.",
              }),
              createGoodDamagingMovesToggleViewModel("that each Pokémon can learn by level up "),
              createConfigurableToggleViewModel({
                id: "GUARANTEE_LEVEL_ONE_MOVES" as const,
                name: "Guarantee Level 1 Moves",
                description: "Adds level 1 moves to a Pokémon's level up moves if they normally have less than the specified number.",
                viewModels: [
                  createIntegerInputViewModel({
                    id: "MINIMUM" as const,
                    name: "Minimum",
                    isRequired: true as const,
                    min: 1,
                    max: 4,
                    value: 4,
                  }),
                ] as const,
              }), // END ADD_LEVEL_ONE_MOVES
              createBannedMovesSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_LEVEL_UP_MOVES
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TM_MOVES" as const,
            name: "Randomize TM Moves",
            description: "Randomize the move that each TM teaches.",
            viewModels: [
              createUniqueMovesSelectorViewModel(),
              createPreferSameTypeMovesToggleViewModel(),
              createSimpleToggleViewModel({
                id: "KEEP_FIELD_MOVES" as const,
                name: "Keep Field Moves",
                description: "Don't randomize TM02 (Headbutt), TM08 (Rock Smash), TM12 (Sweet Scent) or TM28 (Dig).",
              }),
              createGoodDamagingMovesToggleViewModel(),
              createBannedMovesSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_TM_MOVES
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_MOVE_TUTOR_MOVES" as const,
            name: "Randomize Move Tutor Moves",
            description: "Randomize the move that the Move Tutor teaches.",
            viewModels: [
              createUniqueMovesSelectorViewModel(),
              createPreferSameTypeMovesToggleViewModel(),
              createGoodDamagingMovesToggleViewModel(),
              createBannedMovesSelectorViewModel(),
            ] as const,
          }), // END RANDOMIZE_MOVE_TUTOR_MOVES
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_HM_COMPATIBILITY" as const,
            name: "Randomize HM Compatibility",
            description: "Randomizes which HMs each Pokémon can learn from.",
            viewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the HMs.\n\n"
                  + "IMPORTANT: If this is not set to 100% the generated ROM could be unbeatable "
                  + "due to not having access to Pokémon that can learn the HMs required to progress the game.",
                isRequired: false as const,
                min: 0,
                max: 100,
                value: undefined,
              }),
            ] as const,
          }), // END RANDOMIZE_HM_COMPATIBILITY
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TM_COMPATIBILITY" as const,
            name: "Randomize TM Compatibility",
            description: "Randomizes which TMs each Pokémon can learn from.",
            viewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the TMs.",
                isRequired: false as const,
                min: 0,
                max: 100,
                value: undefined,
              }),
            ] as const,
          }), // END RANDOMIZE_TM_COMPATIBILITY
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_MOVE_TUTOR_COMPATIBILITY" as const,
            name: "Randomize Move Tutor Compatibility",
            description: "Randomizes which Move Tutor Moves each Pokémon can learn.",
            viewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the Move Tutor Moves.",
                isRequired: false as const,
                min: 0,
                max: 100,
                value: undefined,
              }),
            ] as const,
          }), // END RANDOMIZE_HM_COMPATIBILITY
          createSimpleMultiSelectorViewModel({
            id: "BANNED_MOVES" as const,
            name: "Globally Banned Moves",
            description: "A list of moves to always exclude when choosing random moves.",
            options: moveIds.map((moveId) => {
              return createSimpleSelectorOption({
                id: moveId,
                name: movesMap[moveId].name,
              })
            }),
          }), // END BANNED_MOVES
        ] as const,
      }), // END MOVES
      createTabViewModel({
        id: "ITEMS" as const,
        name: "Items",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_REGULAR_ITEM_BALLS" as const,
            name: "Randomize Regular Item Balls",
            description: "Change the items received from item balls to random ones. "
              + "Doesn't include item balls that give TM's, HM's or key items.",
            viewModels: [
              createSimpleMultiSelectorViewModel({
                id: "BAN" as const,
                name: "Ban",
                description: "A list of items to exclude when choosing the random items "
                  + "(in addition to the default list of banned items).",
                options: [
                  ...regularItemIds,
                  ...ballItemIds,
                ].map((itemId) => {
                  return createSimpleSelectorOption({
                    id: itemId,
                    name: itemsMap[itemId].name,
                  })
                }),
              }), // END BAN
            ] as const,
          }), // END RANDOMIZE_REGULAR_ITEM_BALLS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TM_ITEM_BALLS" as const,
            name: "Randomize TM Item Balls",
            description: "Change the TM's received from item balls to random ones.",
            viewModels: [
              createSimpleMultiSelectorViewModel({
                id: "BAN" as const,
                name: "Ban",
                description: "A list of items to exclude when choosing the random items "
                  + "(in addition to the default list of banned items).",
                options: tmItemIds.map((itemId) => {
                  return createSimpleSelectorOption({
                    id: itemId,
                    name: itemsMap[itemId].name,
                  })
                }),
              }), // END BAN
            ] as const,
          }), // END RANDOMIZE_TM_ITEM_BALLS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_REGULAR_HIDDEN_ITEMS" as const,
            name: "Randomize Regular Hidden Items",
            description: "Change the items received from hidden items to random ones. "
              + "Doesn't include hidden items that give key items or the items in trash cans.",
            viewModels: [
              createSimpleMultiSelectorViewModel({
                id: "BAN" as const,
                name: "Ban",
                description: "A list of items to exclude when choosing the random items "
                  + "(in addition to the default list of banned items).",
                options: [
                  ...regularItemIds,
                  ...ballItemIds,
                ].map((itemId) => {
                  return createSimpleSelectorOption({
                    id: itemId,
                    name: itemsMap[itemId].name,
                  })
                }),
              }), // END BAN
            ] as const,
          }), // END RANDOMIZE_REGULAR_HIDDEN_ITEMS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_WILD_HELD_ITEMS" as const,
            name: "Randomize Items Held by Wild Pokémon",
            description: "Change the items that wild Pokémon can hold.",
            viewModels: [
              createConfigurableToggleViewModel({
                id: "CHANGE_DISTRIBUTION" as const,
                name: "Change Distribution",
                description: "Change the distribution of which Pokémon can be found holding items in the wild.",
                viewModels: [
                  createSingleSelectorViewModel({
                    id: "DISTRIBUTION" as const,
                    selectedOptionId: "RANDOM",
                    options: [
                      createSimpleSelectorOption({
                        id: "RANDOM" as const,
                        name: "Random",
                        description: "Each species of Pokémon is assigned a random number (from 0 to 2) of items that they can hold in the wild.",
                      }),
                      createSimpleSelectorOption({
                        id: "SHUFFLED" as const,
                        name: "Shuffled",
                        description: "The species of Pokémon that can commonly and rarely be found holding items are shuffled.",
                      }),
                      createSimpleSelectorOption({
                        id: "NONE" as const,
                        name: "None",
                        description: "No wild Pokémon can hold items.",
                      }),
                      createSimpleSelectorOption({
                        id: "COMMON_ONLY" as const,
                        name: "Common Only",
                        description: "Each species of Pokémon is assigned 1 of kind of item that they can commonly be found holding in the wild.",
                      }),
                      createSimpleSelectorOption({
                        id: "RARE_ONLY" as const,
                        name: "Rare Only",
                        description: "Each species of Pokémon is assigned 1 of kind of item that they can rarely be found holding in the wild.",
                      }),
                      createSimpleSelectorOption({
                        id: "FULL" as const,
                        name: "FULL",
                        description: "Each species of Pokémon is assigned 2 of kinds of items that they can hold in the wild. "
                          + "One they can commonly be found holding and one they can rarely be found holding.",
                      }),
                    ] as const,
                  }), // END DISTRIBUTION
                ] as const,
              }), // END RANDOMIZE_WILD_HELD_ITEMS
              createSimpleMultiSelectorViewModel({
                id: "BAN" as const,
                name: "Ban",
                description: "A list of items to exclude when choosing the random items "
                  + "(in addition to the default list of banned items).",
                options: holdableItemIds.map((itemId) => {
                  return createSimpleSelectorOption({
                    id: itemId,
                    name: itemsMap[itemId].name,
                  })
                }),
              }), // END BAN
            ] as const,
          }), // END RANDOMIZE_WILD_HELD_ITEMS
          createConfigurableToggleViewModel({
            id: "CHANGE_STARTER_HELD_ITEMS" as const,
            name: "Change Items Held by Starter Pokémon",
            description: "Change the items that are held by the starter Pokémon.",
            viewModels: [
              createSingleSelectorViewModel({
                selectedOptionId: "RANDOM",
                id: "METHOD" as const,
                options: [
                  createConfigurableSelectorOption({
                    id: "RANDOM" as const,
                    name: "Random",
                    description: "Change the items held by the starter Pokémon to random ones.",
                    viewModels: [
                      createSimpleMultiSelectorViewModel({
                        id: "BAN" as const,
                        name: "Ban",
                        description: "A list of items to exclude when choosing the random items "
                          + "(in addition to the default list of banned items).",
                        options: holdableItemIds.map((itemId) => {
                          return createSimpleSelectorOption({
                            id: itemId,
                            name: itemsMap[itemId].name,
                          })
                        }),
                      }), // END BAN
                    ] as const,
                  }), // END RANDOM
                  createConfigurableSelectorOption({
                    id: "CUSTOM" as const,
                    name: "Custom",
                    description: "Set a specific item for each starter.",
                    viewModels: [
                      createSingleSelectorViewModel({
                        id: "LEFT" as const,
                        name: "Left",
                        description: "The item held by the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "BERRY",
                        options: holdableItemIds.map((itemId) => {
                          return createSimpleSelectorOption({
                            id: itemId,
                            name: itemsMap[itemId].name,
                          })
                        }),
                      }), // END LEFT
                      createSingleSelectorViewModel({
                        id: "MIDDLE" as const,
                        name: "Middle",
                        description: "The item held by the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "BERRY",
                        options: holdableItemIds.map((itemId) => {
                          return createSimpleSelectorOption({
                            id: itemId,
                            name: itemsMap[itemId].name,
                          })
                        }),
                      }), // END MIDDLE
                      createSingleSelectorViewModel({
                        id: "RIGHT" as const,
                        name: "Right",
                        description: "The item held by the starter in the left Poké Ball on the table in Prof. Elm's Lab.",
                        selectedOptionId: "BERRY",
                        options: holdableItemIds.map((itemId) => {
                          return createSimpleSelectorOption({
                            id: itemId,
                            name: itemsMap[itemId].name,
                          })
                        }),
                      }), // END RIGHT
                    ] as const,
                  }), // END CUSTOM
                ] as const,
              }),
            ] as const,
          }), // END CHANGE_STARTER_HELD_ITEMS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TRADE_HELD_ITEMS" as const,
            name: "Randomize Trade Held Items",
            description: "Randomizes the items held by Pokémon offered in the in-game trades.",
            viewModels: [
              createSimpleMultiSelectorViewModel({
                id: "BAN" as const,
                name: "Ban",
                description: "A list of items to exclude when choosing the random items "
                  + "(in addition to the default list of banned items).",
                options: holdableItemIds.map((itemId) => {
                  return createSimpleSelectorOption({
                    id: itemId,
                    name: itemsMap[itemId].name,
                  })
                }),
              }), // END BAN
            ] as const,
          }),
          createConfigurableToggleViewModel({
            id: "SHUFFLE_ITEMS" as const,
            name: "Shuffle Items",
            description: "Create groups of item locations and shuffle the items that can be found at the locations within each group.\n"
              + "When Badges, HMs, Key Items, and/or Menu Items are shuffled, it can result in certain in game events happening out of order, "
              + "this can result in some odd behaviour sometimes, but small changes are made to make sure that everything normally accessible in the vanilla game is still accessible with reasonable conditions.\n"
              + "In addition, a set of rules about how the game works are used to make sure that items that are required in order to progress the game "
              + "will be never be placed in locations that could make it impossible to obtain them. "
              + "The following are included in these rules by default:\n"
              + "- Zephyrbadge and HM05 (Flash) are expected to be obtained before having to enter any dark areas.\n"
              + "- Areas or item locations that require owning or registering certain Pokémon are considered accessible if "
              + "the Pokédex and TM12 (Sweet Scent) are accessible and all random pokemon encounters are accessible "
              + "(this means having access to at least 7 badges as well as the ability to use all HMs except for Fly "
              + "and having access to the Bicycle, Squirtbottle, Pass, S.S.Ticket, Card Key, Clear Bell, Rainbow Wing, TM02 (Headbutt), TM08 (Rock Smash) and all 3 Fishing Rods).",
            viewModels: [
              createGroupMultiSelectorViewModel({
                id: "GROUPS" as const,
                name: "Groups",
                options: itemLocationGroupIds.map((groupId) => {
                  return createSimpleSelectorOption({
                    id: groupId,
                    name: itemLocationGroupsMap[groupId].name,
                  })
                }),
              }), // END GROUPS
              createSimpleMultiSelectorViewModel({
                id: "ACCESS_MODIFIERS" as const,
                name: "Access Modifiers",
                description: "Additional sets of rules to use when determining valid locations for the shuffled items.",
                options: accessRulesetIds.map((rulesetId) => {
                  return createSimpleSelectorOption(accessRulsetsMap[rulesetId])
                }),
              }),
              createSimpleMultiSelectorViewModel({
                id: "EXCLUDE_LOCATIONS" as const,
                name: "Exclude Locations",
                description: "Item locations to exclude from being shuffled.",
                options: itemLocationIds.map((locationId) => {
                  const itemName = itemsMap[itemLocationsMap[locationId].itemId].name
                  
                  return createSimpleSelectorOption({
                    id: locationId,
                    name: locationId,
                    description: itemName,
                    extraKeywords: itemName,
                  })
                }),
              }),
            ] as const,
          }), // END SHUFFLE_ITEMS
          createConfigurableToggleViewModel({
            id: "START_WITH_ITEMS" as const,
            name: "Start With Items",
            description: "Add the selected items to the player's inventory when starting a new game.",
            viewModels: [
              ...createSelectorsFromItemCategories(),
              createConfigurableToggleViewModel({
                id: "REPLACE_EXISTING_ITEMS" as const,
                name: "Replace Existing Items",
                description: "Replaces existing Badges, HMs, Key Items, and Menu Items that are also included in the player's starting inventory with the selected item.",
                viewModels: [
                  createSingleSelectorViewModel({
                    id: "REPLACEMENT" as const,
                    selectedOptionId: "RANDOM",
                    options: [
                      {
                        id: "RANDOM" as const,
                        name: "Random",
                      },
                      ...holdableItemIds.map((itemId) => {
                        return {
                          id: itemId,
                          name: itemsMap[itemId].name,
                        }
                      }),
                    ],
                  }),
                ] as const,
              }),
            ],
          }),
          createSimpleMultiSelectorViewModel({
            id: "BANNED_ITEMS" as const,
            name: "Globally Banned Items",
            description: "A list of items to always exclude when choosing random items.",
            options: holdableItemIds.map((itemId) => {
              return createSimpleSelectorOption({
                id: itemId,
                name: itemsMap[itemId].name,
              })
            }),
          }), // END BANNED_ITEMS
        ] as const,
      }), // END ITEMS
      createTabViewModel({
        id: "ITEM_PROPERTIES" as const,
        name: "Item Properties",
        viewModels: [
          createSimpleToggleViewModel({
            id: "POKEMON_RADAR" as const,
            name: "Pokémon Radar",
            description: "Plays a sound effect when viewing the 'AREA' page of a Pokémon in the Pokédex "
              + "if the Pokémon can be encountered on Land or when surfing in the Water of the player's current area.",
          }),
          createSimpleToggleViewModel({
            id: "BIKE_INDOORS" as const,
            name: "Bike Indoors",
            description: "Allows the player to use the bike inside all buildings.",
          }),
          createSimpleToggleViewModel({
            id: "RODS_ALWAYS_WORK" as const,
            name: "Rods Always Work",
            description: "Allows makes it so fishing rods will trigger a Pokémon encounter every time they are used.",
          }),
          createSimpleToggleViewModel({
            id: "PROGRESSIVE_RODS" as const,
            name: "Progressive Rods",
            description: "Makes it so that whenever a fishing rod is received, "
              + "if the player has a Good Rod, the newly received rod will be a Super Rod, "
              + "if the player doesn't have Good Rod but has an Old Rod, the newly received rod will be a Good Rod,"
              + "if the player has no fishing rods yet, the newly received rod will be an Old Rod.",
          }),
          createSimpleToggleViewModel({
            id: "HEADBUTT_ALWAYS_WORKS" as const,
            name: "Headbutt Always Works",
            description: "Makes it so that headbutting trees in locations that have tree encounters will always trigger a Pokémon encounter.",
          }),
          createSimpleToggleViewModel({
            id: "ROCK_SMASH_ALWAYS_WORKS" as const,
            name: "Change Box Phone Call",
            description: "Makes it so that smashing rocks in locations that have rock encounters will always trigger a Pokémon encounter.",
          }),
          createSimpleToggleViewModel({
            id: "REPEL_ROCKS" as const,
            name: "Repel Rocks",
            description: "Makes it so that repels will also affect rock smash encounters.",
          }),
          createSimpleToggleViewModel({
            id: "REPEL_REFRESH" as const,
            name: "Prompt to Refresh Repels",
            description: "Shows a prompt to use another repel (if you have one of the same type) when a repel runs out.",
          }),
          createSimpleToggleViewModel({
            id: "ESCAPE_ALL_BUILDINGS" as const,
            name: "Escape from all Buildings",
            description: "Enables using Escape Ropes and Dig to escape from the inside of all buildings instead of just caves and dungeons.",
          }),
          createSimpleToggleViewModel({
            id: "POKE_BALLS_NEVER_FAIL" as const,
            name: "Poké Balls Never Fail",
            description: "All Poké Balls are always guaranteed to capture the Pokémon they are use on.",
          }),
          createSimpleToggleViewModel({
            id: "PREVENT_FAILED_POKE_BALL_WOBBLES" as const,
            name: "Prevent Failed Poké Ball Wobbles",
            description: "If a Poké Ball fails to catch a Pokémon, don't show any shake animations.",
          }),
          createSimpleToggleViewModel({
            id: "REMOVE_POKE_BALL_BOUNCE_ANIMATION" as const,
            name: "Remove Poké Ball Bounce Animation",
            description: "Removes the bounce animation after throwing a Poké Ball.",
          }),
          createSimpleToggleViewModel({
            id: "FASTER_ITEM_PICKUP_SFX" as const,
            name: "Faster Item Pickup SFX",
            description: "Changes the sound effect that plays when picking up an item off the ground "
              + "or when receiving a non-TM/HM item from an NPC "
              + "to the sound effect that is normally plays when a Pokémon gains a level.",
          }),
          createSimpleToggleViewModel({
            id: "SHOW_RECEIVED_TM_HM_MOVE_NAMES" as const,
            name: "Show Received TM/HM Move Names",
            description: "When a TM or HM is received, the name of the move it contains is shown.",
          }),
          createSimpleToggleViewModel({
            id: "SINGLE_USE_FRUIT_TREES" as const,
            name: "Single Use Fruit Trees",
            description: "Makes it so fruit trees disappear forever after their item has been received.",
          }),
        ] as const,
      }), // END ITEM_PROPERTIES
      createTabViewModel({
        id: "MARTS" as const,
        name: "Marts",
        viewModels: [
          createSimpleToggleViewModel({
            id: "EARLY_CHARRGROVE_MART_POKE_BALLS" as const,
            name: "Early Cherrygrove Poké Balls",
            description: "Poké Balls will be available to buy in Cherrygrove City Mart "
              + "before giving the Mystery Egg to Prof. Elm.",
          }),
          createSimpleToggleViewModel({
            id: "CHERRYGROVE_MART_REPELS" as const,
            name: "Cherrygrove Repels",
            description: "Add Repels to the Cherrygrove City Mart.",
          }),
          createSimpleToggleViewModel({
            id: "VIOLET_MART_REPELS" as const,
            name: "Violet Repels",
            description: "Add Repels to the Violet City Mart.",
          }),
          createSimpleToggleViewModel({
            id: "BUYABLE_EVOLUTION_STONES" as const,
            name: "Buyable Evolution Stones",
            description: "Add Evolution Stones to the Goldenrod City Mart on the 4th floor.",
          }),
          createSimpleToggleViewModel({
            id: "BUYABLE_TM12" as const,
            name: "Buyable TM12 (Sweet Scent)",
            description: "Add TM12 (Sweet Scent) to the Goldenrod City Mart on the 5th floor "
              + "after obtaining the item from the lady in the gate north of Ilex Forest.",
          }),
          createSimpleToggleViewModel({
            id: "MOVE_TUTOR_ALWAYS_AVAILABLE" as const,
            name: "Move Tutor Always Available",
            description: "Makes it so the move tutor is always available in Goldenrod City "
              + "and doesn't walk away after teaching a move.",
          }),
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_MOVE_TUTOR_COST" as const,
            name: "Randomize Move Tutor Cost",
            description: "Changes the number of coins required to pay to the move tutor when teaching a move to a random number in the chosen range.",
            viewModels: [
              createIntegerRangeInputViewModel({
                id: "RANGE" as const,
                min: 0,
                max: 0xFFFF,
                selectedMinValue: 0,
                selectedMaxValue: 9999,
              }),
            ] as const,
          }),
        ] as const,
      }), // END MARTS
      createTabViewModel({
        id: "OTHER" as const,
        name: "Other",
        viewModels: [
          createSimpleToggleViewModel({
            id: "SKIP_GENDER" as const,
            name: "Skip Gender Selection",
            description: "Skips the gender selection prompt when starting a new game.\n"
              + "The player's gender will be set to value provided in the 'Player Options'.",
          }), // END SKIP_GENDER
          createSimpleToggleViewModel({
            id: "SKIP_NAME" as const,
            name: "Skip Name Selection",
            description: "Skips the name selection prompt when starting a new game.\n"
              + "The player's name will be set to the value provided in the 'Player Options'.",
          }), // END SKIP_NAME
          createSimpleToggleViewModel({
            id: "CHANGE_BOX_PHONE_CALL" as const,
            name: "Change Box Phone Call",
            description: "Adds the option to change the PC box when Bill calls the player to tell them that their current box is full.",
          }),
          createSimpleToggleViewModel({
            id: "SHOW_MOVE_STATS_IN_BATTLE" as const,
            name: "Show Move Stats in Battle",
            description: "Shows the Power and Accuracy of a move while it is selected in the Fight menu of a battle.",
          }),
          createSimpleToggleViewModel({
            id: "SCALE_EXPERIENCE" as const,
            name: "Scale Experience Gain",
            description: "Changes the battle experience calculation to more closely match that of generations 5 and 7+, "
              + "where the experience earned is curved up or down based on the difference in level "
              + "between the fainted Pokémon and the Pokémon earning the experience.",
          }),
          createConfigurableToggleViewModel({
            id: "CHANGE_OVERWORLD_TRAINER_MOVEMENT" as const,
            name: "Change Overworld Trainer Movement Behaviour",
            description: "Changes the behaviour of how trainers with vision move on the overworld.",
            viewModels: [
              createSingleSelectorViewModel({
                id: "MOVEMENT" as const,
                name: "Movement",
                description: "The movement behaviour to apply to the trainers.",
                selectedOptionId: "ROTATE_COUNTER_CLOCKWISE",
                options: Object.values(trainerMovementBehavioursMap).map((movement) => {
                  return createSimpleSelectorOption({
                    id: movement.id,
                    name: movement.name,
                  })
                }),
              }), // END MOVEMENT
              createSimpleMultiSelectorViewModel({
                id: "EXCLUDE" as const,
                name: "Exclude",
                description: "Exclude trainers that have the selected movement behaviours.",
                options: Object.values(trainerMovementBehavioursMap).map((movement) => {
                  return createSimpleSelectorOption({
                    id: movement.id,
                    name: movement.name,
                  })
                }),
              }), // END EXCLUDE
              createSimpleToggleViewModel({
                id: "INCLUDE_STATIONARY" as const,
                name: "Include Stationary Trainers",
                description: "Also changes the behaviour of trainers that normally don't move.",
              }),
            ] as const,
          }), // END CHANGE_OVERWORLD_TRAINER_MOVEMENT
          createSimpleToggleViewModel({
            id: "FLY_BETWEEN_REGIONS" as const,
            name: "Fly Between Regions",
            description: "Adds the ability to press left or right while selecting a location to fly to. "
             + "Doing this will switch the map between Johto and Kanto allowing you to select a location, for which you have the Fly Point, "
             + "in a different region than your current region.",
          }),
          createSimpleToggleViewModel({
            id: "REMOVE_ROUTE_30_ROADBLOCK" as const,
            name: "Remove Route 30 Roadblock",
            description: "Removes the battle between Mikey and Joey that blocks the path on Route 30 at the start of the game allowing you to pass without turning in the Mystery Egg.",
          }),
          createSimpleToggleViewModel({
            id: "REMOVE_ILEX_CUT_TREE" as const,
            name: "Remove Ilex Cut Tree",
            description: "Removes the tree in Ilex Forest that can be cut down allowing you to pass without HM01 (Cut) and/or Hivebadge.",
          }),
          createSimpleToggleViewModel({
            id: "CLEAR_GOLDENROD_STORE_BASEMENT" as const,
            name: "Clear Goldenrod Store Basement",
            description: "Removes permanently removes the boxes blocking the paths to the items in the Goldenrod Department Store Basement allowing them to all be obtained without having to use the elevator multiple times.",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_FLORIA" as const,
            name: "Skip Talking to Floria",
            description: "Removes requirement of having to talk to Floria on Route 36 and in the Flower shop before being able to get the item from the Flower Shop owner.",
          }),
          createSimpleToggleViewModel({
            id: "AUTO_ROCKET_PASSWORDS" as const,
            name: "Auto Rocket Passwords",
            description: "Makes the Rocket Grunts on the bottom floor of Team Rocket's Base automatically tell you their passwords after defeating them.",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_MAHOGANY_ROCKETS" as const,
            name: "Skip Mahogany Rockets",
            description: "After talking to Lance at the Lake of Rage, he will give you HM06 (Whirlpool) "
              + "and the game will act as if you've chased the Rockets out out of their secret base in Mahogany Town "
              + "and shut down their radio transmission from there (but the Electrodes will still be there). "
              + "This causes the following notable changes:\n"
              + "- the Rocket Base and Route 43 Gatehouse will be fully accessible and will have no trainers or cutscenes\n"
              + "- the NPC blocking the entrance to the Mahogany Gym will move out of the way\n"
              + "- the NPC who stops you from going from Mahogany Town to Route 44 will let you go past\n",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_GOLDENROD_ROCKETS" as const,
            name: "Skip Goldenrod Rockets",
            description: "After talking to Lance at the Lake of Rage, he will give you the Basement Key, the Card Key, and the Clear Bell "
              + "and the game will act as if you've chased the Rockets out of Goldenrod City. "
              + "This causes the following notable changes:\n"
              + "- the Goldenrod Radio Tower and underground warehouse will be fully accessible and will have no trainers (other than the Rival) or cutscenes\n"
              + "- the NPC blocking the entrance to the Blackthorn Gym will move out of the way\n"
              + "- the shady shopkeeper in the Mahogany Town Mart will be replaced with the real one",
          }),
          createSimpleToggleViewModel({
            id: "RADIO_CARD_QUIZ_ALWAYS_ACCESSIBLE" as const,
            name: "Make Radio Card Quiz Always Accessible",
            description: "Makes it so the woman, on the first floor of the Goldenrod Radio Tower, who gives the quiz to win the Radio Card is always there, even while Team Rocket has taken over.",
          }),
          createSimpleToggleViewModel({
            id: "BUENA_ALWAYS_GIVES_ITEM" as const,
            name: "Make Buena's Item Always Accessible",
            description: "Makes it so Buena, the radio host on the second floor of the Goldenrod Radio Tower, will always give you her item (the Blue Card, unless it's been shuffled) the first time you talk to her, even while Team Rocket has taken over.",
          }),
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_NUMBER_OF_BERRIES_FOR_MILTANK" as const,
            name: "Randomize Number Of Berries to Heal Miltank",
            description: "Randomizes the number of berries you need to give the Miltank in the barn of Moo Moo Farms on Route 39 before it is healed.",
            viewModels: [
              createIntegerRangeInputViewModel({
                id: "RANGE" as const,
                min: 0,
                max: 10,
                selectedMinValue: 0,
                selectedMaxValue: 7,
              }),
            ] as const,
          }),
          createSimpleMultiSelectorViewModel({
            id: "REMOVE_ROCKET_GRUNTS" as const,
            name: "Remove Rocket Grunts",
            description: "Makes it so the selected Rocket Grunt NPCs never show up in the overworld.",
            options: [
              createSimpleSelectorOption({
                id: "GOLDENROD_FLOWER_SHOP" as const,
                name: "Goldenrod Flower Shop",
                description: "Removes the Rocket Grunt that blocks the entrance to the Goldenrod Flower Shop after the Rockets take over Goldenrod City.",
              }),
              createSimpleSelectorOption({
                id: "GOLDENROD_SE_AREA" as const,
                name: "Goldenrod South East Area",
                description: "Removes the Rocket Grunt that blocks the entrance to the south eastern area of Goldenrod City (which contains the Bike Shop) after the Rockets take over Goldenrod City.",
              }),
            ] as const,
          }),
          createSimpleMultiSelectorViewModel({
            id: "CHANGE_TIN_TOWER_REQUIREMENTS" as const,
            name: "Change Tin Tower Requirements",
            description: "Changes the requirements for getting the item (Rainbow Wing) from the Sage by the staircase on the first floor of Tin Tower "
              + "and revealing the staircase to the 2nd floor of Tin Tower.",
            options: [
              createSimpleSelectorOption({
                id: "SKIP_E4" as const,
                name: "Change E4 Requirement",
                description: "Changes the requirements for getting the item so that instead of having to defeat Champion Lance, you just need to have the Clear Bell.",
              }),
              createSimpleSelectorOption({
                id: "SKIP_BEASTS" as const,
                name: "Remove Beasts Requirement",
                description: "Changes the requirements for getting the item so that you no longer need to have a Suicune, an Entei and a Raikou from your game in your party or PC.",
              }),
            ] as const,
          }),
          createSimpleToggleViewModel({
            id: "CLIMB_TIN_TOWER_FOR_HO_OH_CHAMBER" as const,
            name: "Climb Tin Tower for Ho-oh Chamber",
            description: "Changes the requirments for opening the door in the Ho-oh chamber of the Ruins of Alph "
              + "so that the door opens after the player has fought the Pokémon at the top of Tin Tower "
              + "instead of when the player has a Ho-oh as the first Pokémon in their party.",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_CLAIR_BADGE_TEST" as const,
            name: "Skip Clair's Badge Test",
            description: "Makes it so Clair gives you her Badge and TM immediately after defeating her "
              + "instead of after passing the test in the Dragon Shrine.",
          }),
          createSimpleToggleViewModel({
            id: "ENABLE_GS_BALL_EVENT" as const,
            name: "Enable GS Ball Event",
            description: "After defeating champion Lance, leaving the Goldenrod Pokécenter will trigger an event where someone will walk up to you and give an item (the GS Ball).",
          }),
          createSimpleMultiSelectorViewModel({
            id: "CHANGE_SS_AQUA_REQUIREMENTS" as const,
            name: "Change S.S. Aqua Requirements",
            description: "Changes the requirements for boarding the S.S. Aqua.",
            options: [
              createSimpleSelectorOption({
                id: "SKIP_E4" as const,
                name: "Remove E4 Requirement",
                description: "Removes the requirement of having to defeat Champion Lance before being allowed to board the S.S. Aqua from the Olivine Port.",
              }),
              createSimpleSelectorOption({
                id: "BOARD_ANY_DAY" as const,
                name: "Remove Day Requirement",
                description: "Allows boarding the S.S. Aqua from both the Olivne and Vermilion Ports any day of the week.",
              }),
              createSimpleSelectorOption({
                id: "REBOARD_IMMEDIATELY" as const,
                name: "Allow Reboarding",
                description: "Allows boarding the S.S. Aqua again immediately after disembarking without having to reload the map.",
              }),
            ] as const,
          }),
          createSimpleToggleViewModel({
            id: "FLY_TO_OLIVINE_FROM_PORT" as const,
            name: "Fly To Olivine From Port",
            description: "Makes it so that you can also get the ability to fly to Olivine City when you enter the Olivine Port.",
          }),
          createSimpleToggleViewModel({
            id: "RIDE_TRAIN_WITHOUT_POWER" as const,
            name: "Ride Train Without Power",
            description: "Allows riding the magnet train between Goldenrod and Saffron before fixing the Kanto Power plant.",
          }),
          createSimpleToggleViewModel({
            id: "WEEKDAY_SIBLINGS_ALWAYS_ACCESSIBLE" as const,
            name: "Weekday Siblings Always Accessible",
            description: "Makes is so all the weekday siblings will show up on any day of the week.\n"
              + "Also moves the hidden items that would be under Frieda and Wesley to be in front of them instead.",
          }),
          createSimpleToggleViewModel({
            id: "CELADON_MANSION_ROOF_GIFT_ALWAYS_ACCESSIBLE" as const,
            name: "Celadon Mansion Roof Gift Alwasy Accessible",
            description: "Makes it so that you can get the item from the man in the house on the roof of the Celadon Mansion at any time of day.",
          }),
          createSimpleMultiSelectorViewModel({
            id: "CHANGE_GOLDENROD_DEPT_STORE_TM_GIFTS_REQUIREMENTS" as const,
            name: "Change Goldenrod Dept. Store TM Gifts Requirements",
            description: "Changes the requirements to get the gifts from the receptionist on the 5th floor of the Goldenrod Dept. Store.",
            options: [
              createSimpleSelectorOption({
                id: "REMOVE_DAY_REQUIREMENT" as const,
                name: "Remove Day Requirement",
                description: "Makes it so the items can be received on any day of the week.",
              }),
              createSimpleSelectorOption({
                id: "REMOVE_HAPPINESS_REQUIREMENT" as const,
                name: "Remove Happiness Requirement",
                description: "Makes it so both items can be received regardless of your Pokémon's happiness.\n"
                 + "Also limits it so each item can only be received once.",
              }),
            ],
          }),
          createSimpleToggleViewModel({
            id: "REMOVE_TOHJO_FALLS_HOUSE_GIFT_HAPPINESS_REQUIREMENT" as const,
            name: "Remove Tohjo Falls House Gift Happiness Requirement",
            description: "Makes it so that you can get the item from the lady in the house by Tohjo Falls regardless of your Pokémon's Happiness.",
          }),
          createSimpleMultiSelectorViewModel({
            id: "CHANGE_KENJI_GIFT_REQUIREMENTS" as const,
            name: "Change Kenji Gift Requirements",
            description: "Changes the requirements to get Kenji's gift on Route 45.",
            options: [
              createSimpleSelectorOption({
                id: "REMOVE_TIME_REQUIREMENT" as const,
                name: "Remove Time Requirement",
                description: "Makes it so the item can be received on any day at any time of day.",
              }),
              createSimpleSelectorOption({
                id: "REMOVE_CALL_REQUIREMENT" as const,
                name: "Remove Call Requirement",
                description: "Makes it so Kenji will give you his item without having to call him first.",
              }),
            ],
          }),
          createSimpleToggleViewModel({
            id: "IMPROVE_PERFORMANCE" as const,
            name: "Add Performance Improvements",
            description: "Adds general performance improvements to the game, like removing lag when performing certain actions.",
          }),
          createSimpleToggleViewModel({
            id: "FAST_BATTLE_CRIES" as const,
            name: "Fast Battle Cries",
            description: "Makes it so the Pokémon cries that are heard during battles don't prevent the game from continuing until they are finished.",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_HP_XP_ANIMATIONS" as const,
            name: "Skip HP/XP Animations",
            description: "HP and experience animations are skipped during battle.",
          }),
          createSimpleToggleViewModel({
            id: "SKIP_RUN_SFX" as const,
            name: "Skip Run Sound Effect",
            description: "Skips the run sound effect when running from a wild Pokémon, allowing you to exit the battle faster.",
          }),
          createSimpleMultiSelectorViewModel({
            id: "ADDITIONAL_OPTIONS" as const,
            name: "Additional Options",
            description: "Extra settings that are added to the in game options menu.",
            options: [
              createSimpleSelectorOption({
                id: "INSTANT_TEXT" as const,
                name: "Instant Text",
                description: "A new option for the text speed setting that makes all the text in a single text box appear immediately.",
              }),
              createSimpleSelectorOption({
                id: "HOLD_TO_MASH" as const,
                name: "Hold To Mash",
                description: "A toggle that allows holding down the A or B buttons to mash through text when enabled.",
              }),
              createSimpleSelectorOption({
                id: "NICKNAMES" as const,
                name: "Nicknames",
                description: "A toggle that controls whether the game prompts to nickname newly captured/recieved Pokémon.",
              }),
              createSimpleSelectorOption({
                id: "RIDE_MUSIC" as const,
                name: "Ride Music",
                description: "An option that controls whether the surf and/or bike music will play.",
              }),
            ] as const,
          }), // END ADDITIONAL_OPTIONS
        ] as const,
      }), // END OTHER
    ],
  }
}

const createUniquePokemonSelectorViewModel = () => {
  return createSimpleToggleViewModel({
    id: "UNIQUE" as const,
    name: "Unique",
    description: "Ensures all randomly selected Pokémon are different.",
  })
}

const createBannedPokemonSelectorViewModel = () => {
  return createSimpleMultiSelectorViewModel({
    id: "BAN" as const,
    name: "Ban",
    description: "A list of Pokémon to exclude when choosing the random Pokémon "
      + "(in addition to the default list of banned Pokémon).",
    options: pokemonIds.map((pokemonId) => {
      return createSimpleSelectorOption({
        id: pokemonId,
        name: pokemonMap[pokemonId].name,
      })
    }),
  })
}

const createUniqueMovesSelectorViewModel = (description: string = "Ensures all randomly selected Moves are different.") => {
  return createSimpleToggleViewModel({
    id: "UNIQUE" as const,
    name: "Unique",
    description: description,
  })
}

const createPreferSameTypeMovesToggleViewModel = () => {
  return createSimpleToggleViewModel({
    id: "PREFER_SAME_TYPE" as const,
    name: "Prefer Same Type",
    description: "Only replace moves with moves of the same type, "
      + "unless all moves of that type are banned.",
  })
}

const createGoodDamagingMovesToggleViewModel = (distinguisher: string = "") => {
  return createConfigurableToggleViewModel({
    id: "GOOD_DAMAGING_MOVES" as const,
    name: "Guarantee Percentage of Good Damaging Moves",
    description: `Guarantees that the specified percentage of the Moves ${distinguisher}`
      + "are damaging moves of at least the specified power, unless doing so would conflict with other settings. "
      + "If there is a conflict, as many good moves as possible will be selected.",
    viewModels: [
      createIntegerInputViewModel({
        id: "PERCENTAGE" as const,
        name: "Percentage",
        isRequired: true as const,
        min: 1,
        max: 100,
        value: 25,
      }),
      createIntegerInputViewModel({
        id: "POWER" as const,
        name: "Power",
        isRequired: true as const,
        min: 1,
        max: 250,
        value: 50,
      }),
    ] as const,
  })
}

const createBannedMovesSelectorViewModel = () => {
  return createSimpleMultiSelectorViewModel({
    id: "BAN" as const,
    name: "Ban",
    description: "A list of Moves to exclude when choosing the random Moves "
      + "(in addition to the default list of banned Moves).",
    options: moveIds.map((moveId) => {
      return createSimpleSelectorOption({
        id: moveId,
        name: movesMap[moveId].name,
      })
    }),
  })
}

const createSelectorFromSimpleItemCategory = <ItemCategoryIdType extends ItemCategoryId, ItemIdType extends ItemId>(category: ItemCategory<ItemCategoryIdType, ItemIdType, number>) => {
  return createSimpleMultiSelectorViewModel({
    id: category.id,
    name: category.name,
    maxSelections: category.maxSlots,
    options: category.itemIds.map((itemId) => {
      return createSimpleSelectorOption({
        id: itemId,
        name: itemsMap[itemId].name,
      })
    }),
  })
}

const createSelectorFromConfigurableItemCategory = <ItemCategoryIdType extends ItemCategoryId, ItemIdType extends ItemId>(category: ItemCategory<ItemCategoryIdType, ItemIdType, number>) => {
  return createConfigurableMultiSelectorViewModel({
    id: category.id,
    name: category.name,
    maxSelections: category.maxSlots,
    options: category.itemIds.map((itemId) => {
      return createConfigurableSelectorOption({
        id: itemId,
        name: itemsMap[itemId].name,
        viewModels: [
          createIntegerInputViewModel({
            id: "AMOUNT" as const,
            name: "Amount",
            isRequired: true as const,
            min: 1,
            max: category.slotSize,
            value: 1,
          }),
        ] as const,
      })
    }),
  })
}

type SelectorFromItemCategory<ItemCategoryIdType extends ItemCategoryId, ItemIdType extends ItemId, SlotSizeType extends number> =
  SlotSizeType extends 1 ? ReturnType<typeof createSelectorFromSimpleItemCategory<ItemCategoryIdType, ItemIdType>>
    : ReturnType<typeof createSelectorFromConfigurableItemCategory<ItemCategoryIdType, ItemIdType>>
const createSelectorFromItemCategory = <ItemCategoryIdType extends ItemCategoryId, ItemIdType extends ItemId, SlotSizeType extends number>(category: ItemCategory<ItemCategoryIdType, ItemIdType, SlotSizeType>): SelectorFromItemCategory<ItemCategoryIdType, ItemIdType, SlotSizeType> => {
  if (category.slotSize === 1) {
    return createSelectorFromSimpleItemCategory(category) as SelectorFromItemCategory<ItemCategoryIdType, ItemIdType, SlotSizeType>
  } else {
    return createSelectorFromConfigurableItemCategory(category) as SelectorFromItemCategory<ItemCategoryIdType, ItemIdType, SlotSizeType>
  }
}

type SelectorsMapFromItemCategoriesMap = {
  [ItemCategoryIdType in keyof typeof itemCategoriesMap]: ReturnType<typeof createSelectorFromItemCategory<ItemCategoryIdType, typeof itemCategoriesMap[ItemCategoryIdType]["itemIds"][number], typeof itemCategoriesMap[ItemCategoryIdType]["slotSize"]>>
}

type SelectorsFromItemCategoriesMap = SelectorsMapFromItemCategoriesMap[keyof SelectorsMapFromItemCategoriesMap][]
const createSelectorsFromItemCategories = (): SelectorsFromItemCategoriesMap => {
  return Object.values(itemCategoriesMap).map((category) => {
    return createSelectorFromItemCategory(category) as ReturnType<typeof createSelectorFromItemCategory>
  }) as SelectorsFromItemCategoriesMap
}