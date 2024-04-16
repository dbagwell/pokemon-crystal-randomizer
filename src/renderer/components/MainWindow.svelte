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
  import { AdditionalOptions } from "@shared/gameData/additionalOptions"
  import { itemCategories } from "@shared/gameData/itemData"
  import { pokemon } from "@shared/gameData/pokemonData"
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
          settings: starters.map((starter) => {
            return {
              type: "selection",
              id: starter.id,
              title: starter.title,
              maxSelections: 1, // TODO: Need to change how the input renders a single selection when there can only be 1
              values: [ // TODO: We need to set a default of VANILLA.
                {
                  id: "VANILLA", // TODO: Ignore this when sending the settings?
                  name: "Vanilla",
                },
                {
                  id: "RANDOM",
                  name: "Random",
                // TODO: need more than one sub setting for all the options: same stage, same type, similar stats, evolves twice
                },
                ...pokemon.map((pokemon) => {
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
          values: [
            {
              id: AdditionalOptions.instantText,
              name: "Instant Text",
              description: "A new option for the text speed setting that makes all the text in a single text box appear immediately.",
            },
            {
              id: AdditionalOptions.holdToMash,
              name: "Hold To Mash",
              description: "A toggle that allows holding down the A or B buttons to mash through text when enabled.",
            },
            {
              id: AdditionalOptions.nicknames,
              name: "Nicknames",
              description: "A toggle that controls whether the game prompts to nickname newly captured/recieved Pokémon.",
            },
            {
              id: AdditionalOptions.rideMusic,
              name: "Ride Music",
              description: "An option that controls whether the surf and/or bike music will play.",
            },
          ],
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