import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemLocationGroupsMap } from "@shared/gameData/itemLocationGroups"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import type { ItemCategory } from "@shared/types/gameData/itemCategory"
import { additionalOptionIds } from "@shared/types/gameDataIds/additionalOptions"
import { growthRateIds } from "@shared/types/gameDataIds/growthRates"
import { type ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import { itemLocationGroupIds } from "@shared/types/gameDataIds/itemLocationGroups"
import { ballItemIds, holdableItemIds, type ItemId, itemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { playerSpriteIds } from "@shared/types/gameDataIds/playerSprites"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import {
  createConfigurableMultiSelectorViewModel,
  createConfigurableSelectorOption,
  createConfigurableToggleViewModel,
  createGroupMultiSelectorViewModel,
  createIntegerInputGroupViewModel,
  createIntegerInputViewModel,
  createSimpleMultiSelectorViewModel,
  createSimpleSelectorOption,
  createSimpleToggleViewModel,
  createSingleSelectorViewModel,
  createTabViewModel,
  createTextInputViewModel,
} from "@shared/types/viewModels"

export const defaultAppViewModel = () => {
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
            description: "Randomize the Pokémon asked for and offered in the in-game trades.",
            viewModels: [
              createSingleSelectorViewModel({
                id: "METHOD" as const,
                selectedOptionId: "BOTH",
                options: [
                  createSimpleSelectorOption({
                    id: "BOTH" as const,
                    name: "Both",
                    description: "Randomize both the Pokémon being asked for and the Pokémon being offered in the trade.",
                  }),
                  createSimpleSelectorOption({
                    id: "ASK_ONLY" as const,
                    name: "Ask Only",
                    description: "Randomize only the Pokémon being asked for in the trade.",
                  }),
                  createSimpleSelectorOption({
                    id: "OFFER_ONLY" as const,
                    name: "Offer Only",
                    description: "Randomize only the Pokémon being offered in the trade.",
                  }),
                ] as const,
              }), // END METHOD
              createUniquePokemonSelectorViewModel(),
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
            id: "RANDOMIZE_HIDDEN_ITEMS" as const,
            name: "Randomize Hidden Items",
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
          }), // END RANDOMIZE_HIDDEN_ITEMS
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_WILD_HELD_ITEMS" as const,
            name: "Randomize Items Held by Wild Pokémon",
            description: "Change the items that wild Pokémon can hold.",
            viewModels: [
              createConfigurableToggleViewModel({
                id: "CHANGE_NUMBER_OF_ITEMS_PER_POKEMON" as const,
                name: "Change Number of Items per Pokémon",
                description: "Change the number of different kinds of items each species of Pokémon can hold in the wild.",
                viewModels: [
                  createSingleSelectorViewModel({
                    id: "NUMBER" as const,
                    selectedOptionId: "RANDOM",
                    options: [
                      createSimpleSelectorOption({
                        id: "RANDOM" as const,
                        name: "Random",
                        description: "Each species of Pokémon is assigned a random number (from 0 to 2) of items that they can hold in the wild.",
                      }),
                      createConfigurableSelectorOption({
                        id: "SHUFFLED" as const,
                        name: "Shuffled",
                        description: "The total number of items that can be held by wild Pokémon remains unchanged, "
                          + "but the Pokémon that can hold each of those items is randomized.",
                        viewModels: [
                          createSimpleToggleViewModel({
                            id: "KEEP_RATIOS" as const,
                            name: "Keep Ratios",
                            description: "Make sure that the number of Pokémon that can hold 0, 1, and 2 items respectively remains unchanged.",
                          }),
                        ] as const,
                      }),
                      createSimpleSelectorOption({
                        id: "NONE" as const,
                        name: "0 Items",
                        description: "No wild Pokémon can hold items.",
                      }),
                      createSimpleSelectorOption({
                        id: "ONE" as const,
                        name: "1 Item",
                        description: "Each species of Pokémon is assigned 1 of kind of item that they can hold in the wild.",
                      }),
                      createSimpleSelectorOption({
                        id: "TWO" as const,
                        name: "2 Items",
                        description: "Each species of Pokémon is assigned 2 of kinds of items that they can hold in the wild.",
                      }),
                    ] as const,
                  }), // END NUMBER
                ] as const,
              }), // END CHANGE_NUMBER_OF_ITEMS_PER_POKEMON
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
          createGroupMultiSelectorViewModel({
            id: "SHUFFLED_ITEM_GROUPS" as const,
            name: "Shuffle Items",
            description: "Create groups of item locations and shuffle the items that can be found at the locations within each group.",
            options: itemLocationGroupIds.map((groupId) => {
              return createSimpleSelectorOption({
                id: groupId,
                name: itemLocationGroupsMap[groupId].name,
              })
            }),
          }), // END SHUFFLED_ITEM_GROUPS
          createConfigurableToggleViewModel({
            id: "START_WITH_ITEMS" as const,
            name: "Start With Items",
            description: "Add the selected items to the player's inventory when starting a new game.",
            viewModels: createSelectorsFromItemCategories(),
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
            description: "Add Evolution Stones to the Goledenrod City Mart on the 4th floor.",
          }),
          createSimpleToggleViewModel({
            id: "BUYABLE_TM12" as const,
            name: "Buyable TM12 (Sweet Scent)",
            description: "Add TM12 (Sweet Scent) to the Goledenrod City Mart on the 5th floor "
              + "after obtaining the item from the lady in the gate north of Ilex Forest.",
          }),
        ] as const,
      }), // END MARTS
      createTabViewModel({
        id: "OTHER" as const,
        name: "Other",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "SKIP_GENDER" as const,
            name: "Use Preset Gender",
            description: "Skips the gender selection prompt when starting a new game, "
              + "setting the player's gender to the provided value instead.",
            viewModels: [
              createSingleSelectorViewModel({
                id: "GENDER" as const,
                selectedOptionId: "GIRL",
                options: playerSpriteIds.map((spriteId) => {
                  return createSimpleSelectorOption({
                    id: spriteId,
                    name: playerSpriteMap[spriteId].label,
                  })
                }),
              }), // END GENDER
            ] as const,
          }), // END SKIP_GENDER
          createConfigurableToggleViewModel({
            id: "SKIP_NAME" as const,
            name: "Use Preset Name",
            description: "Skips the name selection prompt when starting a new game, "
              + "setting the player's name to the provided value instead.",
            viewModels: [
              createTextInputViewModel({
                id: "PLAYER_NAME" as const,
                name: "Player Name",
                maxCharacters: 7,
                isRequired: true as const,
                value: "KRIS",
              }),
            ] as const,
          }), // END SKIP_NAME
          createSimpleToggleViewModel({
            id: "CHANGE_BOX_PHONE_CALL" as const,
            name: "Change Box Phone Call",
            description: "Adds the option to change the PC box when Bill calls the player to tell them that their current box is full.",
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
              createSimpleToggleViewModel({
                id: "INCLUDE_STATIONARY" as const,
                name: "Include Stationary Trainers",
                description: "Also changes the behaviour of trainers that normally don't move.",
              }),
            ] as const,
          }), // END CHANGE_OVERWORLD_TRAINER_MOVEMENT
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
          createSimpleMultiSelectorViewModel({
            id: "CHANGE_TIN_TOWER_REQUIREMENTS" as const,
            name: "Change Tin Tower Requirements",
            description: "Changes the requirements to be able to get the Rainbow Wing "
              + "and reveal the staircase to the 2nd floor of Tin Tower.",
            options: [
              createSimpleSelectorOption({
                id: "SKIP_E4" as const,
                name: "Change E4 Requirement",
                description: "Instead of having to defeat Champion Lance, you just need to have the Clear Bell.",
              }),
              createSimpleSelectorOption({
                id: "SKIP_BEASTS" as const,
                name: "Remove Beasts Requirement",
                description: "Removes the requirement of needing to have a Suicune, an Entei and a Raikou from your game in your party or PC.",
              }),
            ] as const,
          }),
          createSimpleToggleViewModel({
            id: "SKIP_CLAIR_BADGE_TEST" as const,
            name: "Skip Clair's Badge Test",
            description: "Makes it so Clair gives you her Badge and TM immediately after defeating her "
              + "instead of after passing the test in the Dragon Shrine.",
          }),
          createSimpleToggleViewModel({
            id: "IMPROVE_PERFORMANCE" as const,
            name: "Add Performance Improvements",
            description: "Adds general performance improvements to the game, like removing lag when performing certain actions.",
          }),
          createSimpleMultiSelectorViewModel({
            id: "ADDITIONAL_OPTIONS" as const,
            name: "Additional Options",
            description: "Extra settings that are added to the in game options menu.",
            options: additionalOptionIds.map((optionId) => {
              return createSimpleSelectorOption({
                id: optionId,
                name: additionalOptionsMap[optionId].name,
                description: additionalOptionsMap[optionId].description,
              })
            }),
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
        value: 20,
      }),
      createIntegerInputViewModel({
        id: "POWER" as const,
        name: "Power",
        isRequired: true as const,
        min: 1,
        max: 250,
        value: 60,
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