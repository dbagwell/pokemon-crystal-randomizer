import { pokemonMap } from "@shared/gameData/pokemon"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { createConfigurableSelectorOption, createConfigurableToggleViewModel, createIntegerInputViewModel, createSimpleMultiSelectorViewModel, createSimpleSelectorOption, createSimpleToggleViewModel, createSingleSelectorViewModel, createTabViewModel, createTextInputViewModel } from "@shared/types/viewModels"

export const defaultAppViewModel = () => {
  return {
    tabViewModels: [
      createTabViewModel({
        id: "POKEMON" as const,
        name: "Pokémon",
        subViewModels: [
          createConfigurableToggleViewModel({
            id: "CHANGE_STARTERS" as const,
            name: "Change Starters",
            description: "Change the starter Pokémon choices offered by Prof. Elm at the start of the game.",
            subViewModels: [
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
                        subViewModels: [
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
            subViewModels: [
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
            subViewModels: [
              createSimpleToggleViewModel({
                id: "REMOVE_TIME_BASED_ENCOUNTERS" as const,
                name: "Remove Time Based Encounters",
                description: "Makes it so that the Pokémon encountered in a specific area are the same regardless of the time of day.",
              }),
              createIntegerInputViewModel({
                id: "FULLY_EVOLVED_LEVEL_THRESHOLD" as const,
                name: "Fully Evolved Level Threshold",
                description: "Ensure all selected Pokémon below the specified level are fully evolved.",
                min: 1,
                max: 100,
                isRequired: false as const,
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
            subViewModels: [
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
            subViewModels: [
              createSimpleToggleViewModel({
                id: "TYPE_THEME_TEAMS" as const,
                name: "Type Theme Teams",
                description: "Ensure all Pokémon on each Trainer's team share at least one common type.",
              }),
              createIntegerInputViewModel({
                id: "FULLY_EVOLVED_LEVEL_THRESHOLD" as const,
                name: "Fully Evolved Level Threshold",
                description: "Ensure all selected Pokémon above the specified level are fully evolved.",
                min: 1,
                max: 100,
                isRequired: false as const,
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
        subViewModels: [
          createConfigurableToggleViewModel({
            id: "INCREASE_POKEMON_CATCH_RATES" as const,
            name: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. "
             + "Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. "
             + "At 100%, all Pokémon are as likely to be caught as Rattata.",
            subViewModels: [
              createIntegerInputViewModel({
                id: "PERCENTAGE" as const,
                name: "Percentage",
                isRequired: true as const,
                min: 0,
                max: 100,
                value: 0,
              }),
            ] as const,
          }), // END INCREASE_POKEMON_CATCH_RATES
        ] as const,
      }), // END POKEMON_PROPERTIES
      createTabViewModel({
        id: "OTHER" as const,
        name: "Other",
        subViewModels: [
          createConfigurableToggleViewModel({
            id: "SKIP_NAME" as const,
            name: "Use Preset Name",
            description: "Skips the name selection prompt when starting a new game, "
              + "setting the player's name to the provided value instead.",
            subViewModels: [
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
    description: "A list of Pokémon to exclude when choosing the random Pokémon (in addition to the default list of banned Pokémon).",
    selectedOptionIds: [],
    options: pokemonIds.map((pokemonId) => {
      return createSimpleSelectorOption({
        id: pokemonId,
        name: pokemonMap[pokemonId].name,
      })
    }),
  })
}