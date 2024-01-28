<div
  style:display="flex"
  style:flex-wrap="wrap"
  style:align-items="center"
  style:gap="10px"
>
  {#if spec.type === "item" || spec.type === "array"}
    <Autocomplete
      getOptionLabel={getValueName}
      label={spec.title}
      options={availableValues}
      bind:value={autocompleteValue}
      on:SMUIAutocomplete:selected={handleAutocompleteSelection}
    />
    
    <Set
      style="display: inline-block;"
      bind:chips={selectedValues}
      let:chip>
      <Chip chip={chip}>
        <Text tabindex={0}>{chip.name}</Text>
        <TrailingAction icon$class="material-icons">cancel</TrailingAction>
      </Chip>
    </Set>
  {/if}
  
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
      <Content>
        {spec.description}
      </Content>
      {#if isNotNullish(spec.values)}
        {#each spec.values as value}
          <Title>
            {value.name}
          </Title>
          <Content>
            {value.description}
          </Content>
        {/each}
      {/if}
    </Tooltip>
  </Wrapper>
</div>

<script lang="ts">
  import type { GeneratorSetting, GeneratorSettingSpec, GeneratorSettingValueSpec } from "@shared/types/generatorSettings"
  import Chip, { Set, Text, TrailingAction } from "@smui/chips"
  import { Icon } from "@smui/common"
  import Tooltip, { Content, Title, Wrapper } from "@smui/tooltip"
  import Autocomplete from "@smui-extra/autocomplete"
  import { isNotNullish } from "@utils"

  export let spec: GeneratorSettingSpec
  
  export const getSetting = (): GeneratorSetting | null => {
    switch (spec.type) {
    case "boolean": {
      return null
    }
    case "integer": {
      return null
    }
    case "item": {
      return null
    }
    case "array": {
      if (selectedValues.length > 0) {
        return {
          id: spec.id,
          value: selectedValues.map((valueSpec) => {
            return valueSpec.id
          }),
        }
      } else {
        return null
      }
    }
    }
  }
  
  // Autocomplete
  
  let autocompleteValue: GeneratorSettingValueSpec | undefined = undefined // Not really used but required to prevent errors
  let availableValues = spec.values
  let selectedValues: GeneratorSettingValueSpec[] = []
  
  const handleAutocompleteSelection = (event: CustomEvent<GeneratorSettingValueSpec>) => {
    event.preventDefault()
    if (spec.type === "array") {
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
  
  const getValueName = (value: GeneratorSettingValueSpec) => {
    if (isNotNullish(value)) {
      return value.name
    } else {
      return ""
    }
  }
  
</script>