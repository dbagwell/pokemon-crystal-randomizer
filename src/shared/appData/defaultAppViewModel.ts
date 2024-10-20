import { growthRatesMap } from "@shared/gameData/growthRates"
import { movesMap } from "@shared/gameData/moves"
import { pokemonMap } from "@shared/gameData/pokemon"
import { growthRateIds } from "@shared/types/gameDataIds/growthRates"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { createConfigurableSelectorOption, createConfigurableToggleViewModel, createIntegerInputViewModel, createSimpleMultiSelectorViewModel, createSimpleSelectorOption, createSimpleToggleViewModel, createSingleSelectorViewModel, createTabViewModel, createTextInputViewModel } from "@shared/types/viewModels"

export const defaultAppViewModel = () => {
  return {
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
          }),
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
              + "in Headbutt trees, under Rock Smash rocks and from fishing to random Pokémon.",
            viewModels: [
              createSimpleToggleViewModel({
                id: "REMOVE_TIME_BASED_ENCOUNTERS" as const,
                name: "Remove Time Based Encounters",
                description: "Makes it so that the Pokémon encountered in a specific area are the same regardless of the time of day.",
              }),
              createIntegerInputViewModel({
                id: "FULLY_EVOLVED_LEVEL_THRESHOLD" as const,
                name: "Fully Evolved Level Threshold",
                description: "Ensure all selected Pokémon below the specified level are fully evolved.",
                isRequired: false as const,
                min: 1,
                max: 100,
                value: undefined,
              }),
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
              createIntegerInputViewModel({
                id: "FULLY_EVOLVED_LEVEL_THRESHOLD" as const,
                name: "Fully Evolved Level Threshold",
                description: "Ensure all selected Pokémon above the specified level are fully evolved.",
                isRequired: false as const,
                min: 1,
                max: 100,
                value: undefined,
              }),
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
        ] as const,
      }), // END POKEMON
      createTabViewModel({
        id: "POKEMON_PROPERTIES" as const,
        name: "Pokémon Properties",
        viewModels: [
          createIntegerInputViewModel({
            id: "INCREASE_POKEMON_CATCH_RATES_PERCENTAGE" as const,
            name: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. "
             + "Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. "
             + "At 100%, all Pokémon are as likely to be caught as Rattata.",
            isRequired: true as const,
            min: 0,
            max: 100,
            value: 0,
          }),
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
                selectedOptionIds: [],
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
          createIntegerInputViewModel({
            id: "HAPPINESS_EVOLUTION_REQUIREMENT" as const,
            name: "Change Happiness Evolution Requirement",
            description: "Sets the minimum happiness required to trigger a happiness evolution.",
            isRequired: false as const,
            min: 0,
            max: 255,
            value: undefined,
          }),
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
              createIntegerInputViewModel({
                id: "LEVEL_ONE_MOVES" as const,
                name: "Guaranteed Number of Level 1 Moves",
                description: "Adds level 1 moves to a Pokémon's level up moves if they normally have less than the specified number.",
                isRequired: false as const,
                min: 1,
                max: 4,
                value: undefined,
              }),
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
            id: "RANDOMIZE_HM_COMPATABILITY" as const,
            name: "Randomize HM Compatability",
            description: "Randomizes which HMs each Pokémon can learn from.",
            viewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                description: "Set this to make all Pokémon be able to learn from that percentage of all the HMs.",
                isRequired: false as const,
                min: 0,
                max: 100,
                value: undefined,
              }),
            ] as const,
          }), // END RANDOMIZE_HM_COMPATABILITY
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_TM_COMPATABILITY" as const,
            name: "Randomize TM Compatability",
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
          }), // END RANDOMIZE_TM_COMPATABILITY
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_MOVE_TUTOR_COMPATABILITY" as const,
            name: "Randomize Move Tutor Compatability",
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
          }), // END RANDOMIZE_HM_COMPATABILITY
        ] as const,
      }), // END MOVES
      createTabViewModel({
        id: "OTHER" as const,
        name: "Other",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "SKIP_NAME" as const,
            name: "Use Preset Name",
            description: "Skips the name selection prompt when starting a new game, "
              + "setting the player's name to the provided value instead.",
            viewModels: [
              createTextInputViewModel({
                id: "PLAYER_NAME" as const,
                maxCharacters: 7,
                isRequired: true as const,
                value: "KRIS",
              }),
            ] as const,
          }), // END SKIP_NAME
          createSimpleToggleViewModel({
            id: "BIKE_INDOORS" as const,
            name: "Bike Indoors",
            description: "Allows the player to use the bike inside all buildings.",
          }),
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
    selectedOptionIds: [],
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
    selectedOptionIds: [],
    options: moveIds.map((moveId) => {
      return createSimpleSelectorOption({
        id: moveId,
        name: movesMap[moveId].name,
      })
    }),
  })
}