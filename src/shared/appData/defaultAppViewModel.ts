import { pokemonMap } from "@shared/gameData/pokemon"
import { pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { createConfigurableSelectorOption, createConfigurableToggleViewModel, createIntegerInputViewModel, createSelectorViewModel, createSimpleSelectorOption, createSimpleToggleViewModel, createTabViewModel, createTextInputViewModel } from "@shared/types/viewModels"

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
            isOn: false,
            subViewModels: [
              createSelectorViewModel({
                selectedOptionId: "RANDOM",
                id: "METHOD" as const,
                options: [
                  createConfigurableSelectorOption({
                    id: "RANDOM" as const,
                    name: "Random",
                    description: "Change the starter Pokémon to random ones.",
                    viewModels: [
                      createSimpleToggleViewModel({
                        id: "UNIQUE" as const,
                        name: "Unique",
                        description: "Make sure all three chosen starter Pokémon are different.",
                        isOn: false,
                      }),
                      createSimpleToggleViewModel({
                        id: "MATCH_TYPE" as const,
                        name: "Match Type",
                        description: "Make sure each chosen starter Pokémon shares a type with the Pokémon it's replacing.",
                        isOn: false,
                      }),
                      createSimpleToggleViewModel({
                        id: "MATCH_STAGE" as const,
                        name: "Match Stage",
                        description: "Make sure each chosen starter Pokémon doesn't have any pre-evolutions.",
                        isOn: false,
                      }),
                      createSimpleToggleViewModel({
                        id: "MATCH_EVOLUTIONS" as const,
                        name: "Match Evolutions",
                        description: "Make sure each chosen starter Pokémon can evolve twice.",
                        isOn: false,
                      }),
                      createConfigurableToggleViewModel({
                        id: "MATCH_SIMILAR_BST" as const,
                        name: "Match Similar BST",
                        description: "Make sure each chosen starter Pokémon's Base Stat Total is within a specified threshold of the Pokémon it's replacing.",
                        isOn: false,
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
                      }),
                    ] as const,
                  }),
                  createConfigurableSelectorOption({
                    id: "CUSTOM" as const,
                    name: "Custom",
                    description: "Set a specific Pokémon for each starter.",
                    viewModels: [
                      createSelectorViewModel({
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
                      }),
                      createSelectorViewModel({
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
                      }),
                      createSelectorViewModel({
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
                      }),
                    ] as const,
                  }),
                ] as const,
              }),
              createSimpleToggleViewModel({
                id: "CHANGE_RIVALS_STARTER" as const,
                name: "Also Change Rival's Starter",
                description: "Change the Pokémon on the Rival's Pokémon teams to match the Pokémon that appears to be stolen from Prof. Elm's Lab.",
                isOn: false,
              }),
            ] as const,
          }),
          createConfigurableToggleViewModel({
            id: "RANDOMIZE_EVENT_POKEMON" as const,
            name: "Randomize Event Pokémon",
            description: "Changes the Pokémon encountered or gifted during special events to random Pokémon.",
            isOn: false,
            subViewModels: [
              createSimpleToggleViewModel({
                id: "UNIQUE" as const,
                name: "Unique",
                description: "Ensures all event Pokémon are different.",
                isOn: false,
              }),
              createSelectorViewModel({
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
              }),
            ] as const,
          }),
        ] as const,
      }),
      createTabViewModel({
        id: "POKEMON_PROPERTIES" as const,
        name: "Pokémon Properties",
        subViewModels: [
          {
            type: "TOGGLE" as const,
            id: "INCREASE_POKEMON_CATCH_RATES" as const,
            name: "Increase Pokémon Catch Rates",
            description: "Makes it more likely for Pokémon to be caught. "
             + "Increases each species' catch rate by a percentage of the difference between its vanilla catch rate and the max. "
             + "At 100%, all Pokémon are as likely to be caught as Rattata.",
            isOn: false,
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
          },
        ] as const,
      }),
      createTabViewModel({
        id: "OTHER" as const,
        name: "Other",
        subViewModels: [
          createConfigurableToggleViewModel({
            id: "SKIP_NAME" as const,
            name: "Use Preset Name",
            description: "Skips the name selection prompt when starting a new game, "
              + "setting the player's name to the provided value instead.",
            isOn: false,
            subViewModels: [
              createTextInputViewModel({
                id: "PLAYER_NAME" as const,
                maxCharacters: 7,
                isRequired: true as const,
                value: "KRIS",
              }),
            ] as const,
          }),
          createSimpleToggleViewModel({
            id: "BIKE_INDOORS" as const,
            name: "Bike Indoors",
            description: "Allows the player to use the bike inside all buildings.",
            isOn: false,
          }),
        ] as const,
      }),
    ],
  }
}