<div
  style:display="flex"
  style:flex-wrap="wrap"
  style:align-items="center"
  style:gap="10px"
>
  {#if spec.type === "integer"}
    <Textfield
      input$max={spec.max}
      input$min={spec.min}
      label={spec.title}
      type="number"
      bind:value={integerValue}
    >
    </Textfield>
  {/if}
  
  {#if spec.type === "item" || spec.type === "array"}
    <Autocomplete
      getOptionLabel={getValueName}
      label={spec.title}
      options={availableValues}
      bind:value={autocompleteValue}
      on:SMUIAutocomplete:selected={handleAutocompleteSelection}
    />
  {/if}
  
  {#if isNotNullish(spec.description) || isNotNullish(spec.values) && spec.values.find((value) => { return isNotNullish(value.description) })}
    <Wrapper
      style="height:24px"
      rich={true}
    >
      <Icon
        style="cursor:pointer;"
        class="material-icons"
      >
        info
      </Icon>
  
      <!-- TODO Tooltip doesn't properly adjust for the position in the view port (even though the documentation says it should). -->
      <Tooltip
        style="width:500px;"
        interactive={true}
        persistent={true}
        xPos="start"
        yPos="below"
      >
        {#if isNotNullish(spec.description)}
          <Content>
            {spec.description}
          </Content>
        {/if}
        {#if isNotNullish(spec.values)}
          {#each spec.values as value}
            {#if isNotNullish(value.description)}
              <Title>
                {value.name}
              </Title>
              <Content>
                {value.description}
              </Content>
            {/if}
          {/each}
        {/if}
      </Tooltip>
    </Wrapper>
  {/if}
</div>

{#if selectedValues.length > 0}
  {#each selectedValues as value, index (value.id)}
    <div
      style:display="flex"
      style:flex-wrap="wrap"
      style:align-items="center"
      style:gap="10px"
      style:padding="5px"
    >
      <Icon
        style="cursor:pointer;"
        class="material-icons"
        on:click={() => { selectedValues.splice(index, 1); selectedValues = selectedValues }}
      >
        cancel
      </Icon>
      {value.name}
      {#if isNotNullish(value.type) && isNotNullish(spec.valueTypes) && isNotNullish(spec.valueTypes[value.type]) && isNotNullish(spec.valueTypes[value.type].input)}
        <svelte:self
          bind:this={selectedValuesInputs[value.id]}
          spec={spec.valueTypes[value.type].input}
        />
      {/if}
      {#if isNotNullish(value.description)}
        <Wrapper
          style="height:24px"
          rich={true}
        >
          <Icon
            style="cursor:pointer;"
            class="material-icons"
          >
            info
          </Icon>
        
          <!-- TODO Tooltip doesn't properly adjust for the position in the view port (even though the documentation says it should). -->
          <Tooltip
            style="width:500px;"
            interactive={true}
            persistent={true}
            xPos="start"
            yPos="below"
          >
            {#if isNotNullish(value.description)}
              <Content>
                {value.description}
              </Content>
            {/if}
          </Tooltip>
        </Wrapper>
      {/if}
    </div>
  {/each}
{/if}

<script lang="ts">
  import type { GeneratorSetting, GeneratorSettingSpec, GeneratorSettingValueSpec } from "@shared/types/generatorSettings"
  import { Icon } from "@smui/common"
  import Textfield from "@smui/textfield"
  import Tooltip, { Content, Title, Wrapper } from "@smui/tooltip"
  import Autocomplete from "@smui-extra/autocomplete"
  import { isNotNullish, isNumber } from "@utils"
  
  export let spec: GeneratorSettingSpec
  
  export const getSetting = (): GeneratorSetting | null => {
    switch (spec.type) {
    case "boolean": {
      return null
    }
    case "integer": {
      return {
        id: spec.id,
        value: integerValue,
      }
    }
    case "item": {
      return null
    }
    case "array": {
      if (selectedValues.length > 0) {
        return {
          id: spec.id,
          value: selectedValues.map((valueSpec) => {
            if (
              isNotNullish(valueSpec.type)
                && isNotNullish(spec.valueTypes)
                && isNotNullish(spec.valueTypes[valueSpec.type])
                && isNotNullish(spec.valueTypes[valueSpec.type].input)
            ) {
              return {
                id: valueSpec.id,
                value: selectedValuesInputs[valueSpec.id].getSetting(),
              }
            } else {
              return valueSpec.id
            }
          }),
        }
      } else {
        return null
      }
    }
    }
  }
  
  let autocompleteValue: GeneratorSettingValueSpec | undefined = undefined // Not really used but required to prevent errors
  let availableValues = spec.values
  let selectedValues: GeneratorSettingValueSpec[] = []
  const selectedValuesInputs: Dictionary<any> = {} // TODO: Handle default values? // Unfortunately I think this needs to be any because we can't reference our own type
  let integerValue = 0
  
  if (isNumber(spec.defaultValue)) {
    integerValue = spec.defaultValue
  } else if (Array.isArray(spec.defaultValue)) {
    selectedValues = spec.defaultValue
  }
  
  const handleAutocompleteSelection = (event: CustomEvent<GeneratorSettingValueSpec>) => {
    event.preventDefault()
    if (spec.type === "array") {
      if (
        isNotNullish(event.detail.type)
          && isNotNullish(spec.valueTypes)
          && isNotNullish(spec.valueTypes[event.detail.type])
          && isNotNullish(spec.valueTypes[event.detail.type].max)
          && selectedValues.filter((value) => { return value.type === event.detail.type }).length >= spec.valueTypes[event.detail.type].max
      ) {
      // Show Error Message
      } else {
        selectedValues.push(event.detail)
        selectedValues = selectedValues
      
        if (isNotNullish(spec.values)) {
          availableValues = spec.values!.filter((value) => {
            return !selectedValues.find((selectedValue) => {
              return selectedValue.id === value.id
            })
          })
        }
      }
    }
  }
  
  const getValueName = (value: GeneratorSettingValueSpec) => {
    if (isNotNullish(value)) {
      return value.name
    } else {
      return ""
    }
  }
  
  $: integerValue, integerValueListener()
  const integerValueListener = () => {
    if (isNotNullish(spec.max) && integerValue > spec.max) {
      integerValue = spec.max
    } else if (isNotNullish(spec.min) && integerValue < spec.min) {
      integerValue = spec.min
    } else {
      integerValue = Math.floor(integerValue)
    }
  }
  
</script>