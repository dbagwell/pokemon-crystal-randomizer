
<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <AutocompleteTextField
    bind:this={autocompleteTextField}
    clearOnFocus={true}
    clearOnSelect={config.multiselect}
    label={config.label}
    options={availableOptions.map((option) => {
      return {
        id: option.id,
        name: option.label,
        keywords: option.label,
        value: option.id,
      }
    })}
    restoreOnBlur={!config.multiselect && isNotNullish(config.required) && config.required}
    on:select={handleAutocompleteSelection}
  />
  <!-- TODO: Description -->

  {#if config.multiselect && (config.selectedOptionIds.length ?? 0) > 0}
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="start"
      minSpacing={5}
      padding={5}
    >
      {#each selectedOptions as option, index (option.id)}
        <Stack
          alignment="center"
          direction="horizontal"
          distribution="fill"
          minSpacing={5}
        >
          <Icon
            style="cursor:pointer;"
            class="material-icons"
            on:click={() => { removeSelectedValue(index) }}
          >
            cancel
          </Icon>
          <div
            style:text-wrap="nowrap"
            style:flex-grow="1"
          >
            {option.label}
          </div>
          {#if isNotNullish(option.subElementConfigs)}
            <Stack
              alignment="start"
              direction="vertical"
              distribution="start"
              minSpacing={10}
            >
              {#each Object.entries(option.subElementConfigs) as [id, subConfig] (id)}
                <FormElement config={subConfig}/>
              {/each}
            </Stack>
          {/if}
        </Stack>
      {/each}
    </Stack>
  {/if}
</Stack>

<script lang="ts">
  import FormElement from "@components/formElements/FormElement.svelte"
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { Icon } from "@smui/common"
  import { onMount } from "svelte"
  
  export let config: SelectorInputConfig
  
  let availableOptions: SelectorInputOption[] = []
  let selectedOptions: SelectorInputOption[] = []
  
  let autocompleteTextField: AutocompleteTextField
  
  onMount(() => {
    config = config
  })
  
  const handleAutocompleteSelection = (event: CustomEvent) => {
    if (config.multiselect) {
      if (isNullish(event.detail)) {
        return
      }
      
      config.selectedOptionIds.push(event.detail)
      config.selectedOptionIds = config.selectedOptionIds
    } else {
      config.value = event.detail
    }
  }
  
  const removeSelectedValue = (index: number) => {
    if (!config.multiselect) {
      return
    }
    
    config.selectedOptionIds.splice(index, 1)
    config.selectedOptionIds = config.selectedOptionIds
  }
  
  $: config.multiselect && config.selectedOptionIds, selectedOptionIdsListener()
  const selectedOptionIdsListener = () => {
    availableOptions = config.options.filter((option) => {
      if (config.multiselect) {
        return !(config.selectedOptionIds.includes(option.id) ?? false)
      } else {
        return true
      }
    })
    
    if (config.multiselect) {
      selectedOptions = config.selectedOptionIds.map((optionId) => {
        return config.options.find((option) => {
          return option.id === optionId
        })!
      })
    }
  }
  
  $: !config.multiselect && config.value, valueListener()
  const valueListener = () => {
    if (isNullish(autocompleteTextField) || config.multiselect) {
      return
    }
    
    const configValue = config.value
    
    const option = config.options.find((option) => {
      return option.id === configValue
    })
    
    autocompleteTextField.filter = option?.label ?? ""
    autocompleteTextField.previousSelection = option
  }
</script>