<Paper>
  <Title>Pokémon Crystal Randomizer</Title>
  <Subtitle>Generate and apply patches to Pokémon Crystal Version.</Subtitle>
  <Content>
    {#each categories as category}
      <SettingsContainer
        bind:this={settingsContainers[category.id]}
        category={category}
      />
      <br>
    {/each}
    <Button
      variant="raised"
      on:click={generateROMButtonClicked}
    >
      <Label>GENERATE ROM</Label>
    </Button>
  </Content>
</Paper>

<ProgressIndicator/>

<DialogContainer/>

<script lang="ts">
  import DialogContainer, { showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/ProgressIndicator.svelte"
  import SettingsContainer from "@components/SettingsContainer.svelte"
  import { additionalOptionsMap } from "@shared/gameData/additionalOptions"
  import { itemCategories } from "@shared/gameData/items"
  import { pokemonMap } from "@shared/gameData/pokemon"
  import { isNotNullish, reduceDictionaryInto } from "@shared/utils"
  import Button, { Label } from "@smui/button"
  import Paper, { Content, Subtitle, Title } from "@smui/paper"
  import { onMount } from "svelte"
  
  export let initialSettings: any | undefined
  
  onMount(() => {
    Object.entries(settingsContainers).forEach(([categoryId, container]) => {
      const settings = initialSettings[categoryId]
      
      if (isNotNullish(settings)) {
        container.setSettings(settings)
      }
    })
  })
  
  const starters = [
    {
      id: "left",
      title: "Left (Cyndaquil)",
    },
    {
      id: "middle",
      title: "Middle (Totodile)",
    },
    {
      id: "right",
      title: "Right (Chikorita)",
    },
  ]
  
  const categories: Category[] = [
    {
      id: "pokemon",
      title: "Pokémon",
      subcategories: [
        {
          id: "starters",
          title: "Starters",
          layout: "row",
          settings: [
            {
              type: "boolean",
              id: "random",
              title: "Random",
              settings: [
                {
                  type: "boolean",
                  id: "preventDuplicates",
                  title: "Prevent Duplicates",
                },
                {
                  type: "boolean",
                  id: "matchType",
                  title: "Match Type",
                },
                {
                  type: "boolean",
                  id: "matchStage",
                  title: "Match Stage",
                },
                {
                  type: "boolean",
                  id: "matchEvolutions",
                  title: "Match Evolutions",
                },
                {
                  type: "boolean",
                  id: "matchStatsThreshold",
                  title: "Match Stats",
                  settings: [
                    {
                      type: "integer",
                      id: "threshold",
                      title: "Threshold",
                      min: 0,
                      max: 371,
                      default: 50,
                    },
                  ],
                },
                {
                  type: "multiselect",
                  id: "ban",
                  title: "Ban",
                  values: Object.values(pokemonMap).map((pokemon) => {
                    return {
                      id: pokemon.id,
                      name: pokemon.name,
                    }
                  }),
                },
              ],
            },
          ],
          subcategories: [
            {
              id: "custom",
              title: "Custom Overrides",
              layout: "row",
              settings: starters.map((starter) => {
                return {
                  type: "selection",
                  id: starter.id,
                  title: starter.title,
                  values: [
                    ...Object.values(pokemonMap).map((pokemon) => {
                      return {
                        id: pokemon.id,
                        name: pokemon.name,
                      }
                    }),
                  ],
                }
              }),
            },
          ],
        },
      ],
    },
    {
      id: "items",
      title: "Items",
      subcategories: [
        {
          id: "startingInventory",
          title: "Starting Inventory",
          description: "Items to start the game with.",
          layout: "row",
          settings: itemCategories.map((itemType) => {
            return {
              type: "multiselect",
              id: itemType.id,
              title: itemType.name,
              maxSelections: itemType.maxSlots,
              values: itemType.items.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  setting: itemType.slotSize < 2 ? undefined : {
                    type: "integer",
                    id: item.id,
                    title: "Amount",
                    min: 0,
                    max: itemType.slotSize,
                    default: 1,
                  },
                }
              }),
            }
          }),
        },
      ],
    },
    {
      id: "other",
      title: "Other",
      settings: [
        {
          type: "multiselect",
          id: "additionalOptions",
          title: "Additional Options",
          description: "Extra settings that are added to the in game options menu.",
          values: Object.values(additionalOptionsMap),
        },
      ],
    },
  ]
  
  const settingsContainers: Dictionary<SettingsContainer> = {}
  
  const generateROMButtonClicked = async () => {
    const settings = reduceDictionaryInto(settingsContainers, {}, (object, key, value) => {
      object[key] = value.getValues()
    })
    
    try {
      showProgressIndicator()
      console.log(settings)
      const response = await window.mainAPI.generateROM(settings)
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>