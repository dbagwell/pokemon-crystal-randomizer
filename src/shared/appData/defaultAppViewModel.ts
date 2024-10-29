import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
import { growthRatesMap } from "@shared/gameData/growthRates"
import { itemCategoriesMap } from "@shared/gameData/itemCategories"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { pokemonMap } from "@shared/gameData/pokemon"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"
import { additionalOptionIds } from "@shared/types/gameDataIds/additionalOptions"
import { growthRateIds } from "@shared/types/gameDataIds/growthRates"
import { itemCategoryIds } from "@shared/types/gameDataIds/itemCategories"
import { moveIds } from "@shared/types/gameDataIds/moves"
import { playerSpriteIds } from "@shared/types/gameDataIds/playerSprites"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { createConfigurableMultiSelectorViewModel, createConfigurableSelectorOption, createConfigurableToggleViewModel, createIntegerInputGroupViewModel, createIntegerInputViewModel, createSimpleMultiSelectorViewModel, createSimpleSelectorOption, createSimpleToggleViewModel, createSingleSelectorViewModel, createTabViewModel, createTextInputViewModel } from "@shared/types/viewModels"

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
                id: "CONTEST" as const,
                name: "Bug Catching Contest",
                min: 0,
                max: 100,
                sum: 100,
                values: [20, 20, 10, 10, 5, 5, 10, 10, 5, 5],
              }),
            ] as const,
          }), // END CHANGE_POKEMON_ENCOUNTER_RATIOS
          createIntegerInputViewModel({
            id: "INCREASE_POKEMON_CATCH_RATES_PERCENTAGE" as const,
            name: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. "
             + "Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. "
             + "At 100%, all Pokémon are as likely to be caught as Rattata.",
            isRequired: false as const,
            min: 0,
            max: 100,
            value: undefined,
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
        id: "ITEMS" as const,
        name: "Items",
        viewModels: [
          createConfigurableToggleViewModel({
            id: "START_WITH_ITEMS" as const,
            name: "Start With Items",
            description: "Add the selected items to the player's inventory when starting a new game.",
            viewModels: itemCategoryIds.map((categoryId) => {
              const category = itemCategoriesMap[categoryId]
              if (category.slotSize === 1) {
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
              } else {
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
            }),
          }), // END START_WITH_ITEMS
        ] as const,
      }), // END ITEMS
      createTabViewModel({
        id: "ITEM_PROPERTIES" as const,
        name: "Item Properties",
        viewModels: [
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
                maxCharacters: 7,
                isRequired: true as const,
                value: "KRIS",
              }),
            ] as const,
          }), // END SKIP_NAME
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