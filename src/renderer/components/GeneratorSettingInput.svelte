<div
  style:display="flex"
  style:flex-wrap="wrap"
  style:flex-direction="column"
  style:align-items="left"
  style:gap="10px"
>
  <div
    style:display="flex"
    style:flex-wrap="wrap"
    style:flex-direction="row"
    style:align-items="center"
    style:gap="10px"
  >
    {#if setting.type === "boolean"}
      <Stack
        alignment="start"
        direction="vertical"
        distribution="fill"
      >
        <div style:cursor="pointer">
          <input
            id={setting.id}
            style:cursor="pointer"
            type="checkbox"
            bind:checked={booleanValue}
          />
          <label
            style:cursor="pointer"
            for={setting.id}
          >
            {setting.title}
          </label>
        </div>
        {#if isNotNullish(setting.settings) && booleanValue}
          <Stack
            alignment="start"
            direction="vertical"
            distribution="fill"
            padding={[0, 0, 0, 20]}
          >
            {#each setting.settings as subSetting (subSetting.id)}
              <svelte:self
                bind:this={subsettingInputs[subSetting.id]}
                setting={subSetting}
              />
            {/each}
          </Stack>
        {/if}
      </Stack>
    {/if}
    {#if setting.type === "integer"}
      <Textfield
        style="min-width: 50px;"
        input$max={setting.max}
        input$min={setting.min}
        label={setting.title}
        type="number"
        bind:value={integerValue}
      >
      </Textfield>
    {/if}
  
    {#if isAutocomplete(setting)}
      <AutocompleteTextField
        bind:this={autocompleteTextField}
        clearOnFocus={true}
        clearOnSelect={setting.type === "multiselect"}
        label={setting.title}
        options={availableValues.map((value) => {
          return {
            id: value.id,
            name: value.name,
            keywords: value.name,
            value: value,
          }
        })}
        restoreOnBlur={false}
        on:select={handleAutocompleteSelection}
      />
    {/if}
  
    {#if isNotNullish(setting.description) || isAutocomplete(setting) && isNotNullish(setting.values) && setting.values.find((value) => { return isNotNullish(value.description) })}
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
          {#if isNotNullish(setting.description)}
            <Content>
              {setting.description}
            </Content>
          {/if}
          {#if isAutocomplete(setting) && isNotNullish(setting.values)}
            {#each setting.values as value}
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
    <div
      style:display="flex"
      style:flex-direction="row"
    >
      <div
        style:display="flex"
        style:flex-wrap="wrap"
        style:flex-direction="column"
        style:flex-shrink="0"
        style:align-items="left"
        style:gap="5px"
      >
        {#each selectedValues as value, index (value.id)}
          <div
            style:display="flex"
            style:align-items="center"
            style:justify-content="justify"
            style:gap="5px"
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
              {value.name}
            </div>
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
            {#if isNotNullish(value.setting)}
              <svelte:self
                bind:this={selectedValuesInputs[value.id]}
                setting={value.setting}
              />
            {/if}
          </div>
        {/each}
      </div>
      <div style:flex-grow="1"></div>
    </div>
  {/if}
</div>

<script lang="ts">
  import AutocompleteTextField from "@components/AutocompleteTextField.svelte"
  import Stack from "@components/Stack.svelte"
  import { Icon } from "@smui/common"
  import Textfield from "@smui/textfield"
  import Tooltip, { Content, Title, Wrapper } from "@smui/tooltip"
  import { isNotNullish, isNumber, isString, reduceDictionaryInto } from "@utils"
  import { onMount } from "svelte"
  
  export let setting: Setting
  
  export const setValue = (value: any) => {
    switch (setting.type) {
    case "boolean": {
      if (typeof value === "boolean") {
        booleanValue = value
      } else if (isNotNullish(value)) {
        booleanValue = true
        
        if (isNotNullish(setting.settings)) {
          setting.settings.forEach((setting) => {
            setting.preset = value[setting.id]
          })
        }
      }
      break
    }
    case "integer": {
      if (isNumber(value) && Number.isInteger(value)) {
        integerValue = value
      }
      break
    }
    case "selection": {
      selectedValue = availableValues.find((availableValue) => {
        if (isString(value)) {
          return availableValue.id === value
        } else if (Object.keys(value).length > 0) {
          return availableValue.id === Object.keys(value)[0]
        } else {
          return false
        }
      })
      
      autocompleteTextField.filter = selectedValue?.name ?? ""
      break
    }
    case "multiselect": {
      if (Array.isArray(value)) {
        value.forEach((value) => {
          const selectedValue = availableValues.find((availableValue) => {
            if (isString(value)) {
              return availableValue.id === value
            } else if (Object.keys(value).length > 0) {
              return availableValue.id === Object.keys(value)[0]
            } else {
              return false
            }
          })
          
          if (isNotNullish(selectedValue)) {
            if (Object.keys(value).length > 0) {
              const presetValue = Object.values(value)[0]
                
              if (isNotNullish(selectedValue.setting) && selectedValue.setting.type === "integer" && isNumber(presetValue) && Number.isInteger(presetValue)) {
                selectedValue.setting.preset = presetValue
              }
            }
            
            addSelectedValue(selectedValue)
          }
        })
      }
      
      break
    }
    }
  }
  
  export const getValue = (): any => {
    switch (setting.type) {
    case "boolean": {
      if (isNotNullish(setting.settings) && setting.settings.length > 0) {
        if (booleanValue) {
          if (setting.settings.length > 1) {
            return reduceDictionaryInto(subsettingInputs, {}, (result, key, value) => {
              result[key] = value.getValue()
            })
          } else {
            return subsettingInputs[setting.settings[0].id].getValue()
          }
        } else {
          return undefined
        }
      } else {
        return booleanValue
      }
    }
    case "integer": {
      return integerValue
    }
    case "selection": {
      if (isNotNullish(selectedValue?.setting)) {
        return {
          [selectedValue.id]: selectedValuesInputs[selectedValue.id].getValue(),
        }
      } else {
        return selectedValue?.id
      }
    }
    case "multiselect": {
      if (selectedValues.length > 0) {
        return selectedValues.map((value) => {
          if (isNotNullish(value.setting)) {
            return {
              [value.id]: selectedValuesInputs[value.id].getValue(),
            }
          } else {
            return value.id
          }
        })
      } else {
        return undefined
      }
    }
    }
  }
  
  onMount(() => {
    if (isNotNullish(setting.preset)) {
      setValue(setting.preset)
    }
  })
  
  const isAutocomplete = (setting: Setting): setting is (BaseSetting & SelectionSetting) | (BaseSetting & MultiselectSetting) => {
    return setting.type === "multiselect" || setting.type === "selection"
  }
  
  let autocompleteTextField: AutocompleteTextField
  const subsettingInputs: Dictionary<any> = {} // Unfortunately I think this needs to be any because we can't reference our own type
  const selectedValuesInputs: Dictionary<any> = {} // Unfortunately I think this needs to be any because we can't reference our own type
  
  let availableValues = isAutocomplete(setting) ? setting.values : []
  let selectedValue: SelectionSettingValue | undefined = undefined
  let selectedValues: SelectionSettingValue[] = []
  let booleanValue = false
  let integerValue = setting.type === "integer" ? setting.default : 0
  
  const handleAutocompleteSelection = (event: CustomEvent<string>) => {
    if (setting.type === "selection") {
      selectedValue = availableValues.find((value) => { return value.id === event.detail })
    } else if (setting.type === "multiselect") {
      const value = availableValues.find((value) => { return value.id === event.detail })
      if (isNotNullish(value)) {
        addSelectedValue(value)
      }
    }
  }
  
  const addSelectedValue = (value: SelectionSettingValue) => {
    if (setting.type !== "multiselect") { return }
    if (isNotNullish(setting.maxSelections) && selectedValues.length >= setting.maxSelections) {
    // Show Error Message
    } else {
      selectedValues.push(value)
      selectedValues = selectedValues
      
      if (isNotNullish(setting.values)) {
        availableValues = setting.values!.filter((value) => {
          return !selectedValues.find((selectedValue) => {
            return selectedValue.id === value.id
          })
        })
      }
    }
  }
  
  const removeSelectedValue = (index: number) => {
    const selectedValue = selectedValues[index]
    
    if (isNotNullish(selectedValue.setting) && selectedValue.setting.type === "integer") {
      selectedValue.setting.preset = undefined
    }
    
    availableValues.push(selectedValue)
    availableValues = availableValues.sort((a, b) => { return a.name > b.name ? 1 : -1 })
    selectedValues.splice(index, 1); selectedValues = selectedValues
  }
  
  $: integerValue, integerValueListener()
  const integerValueListener = () => {
    if (setting.type !== "integer") { return }
    if (isNotNullish(setting.max) && integerValue > setting.max) {
      integerValue = setting.max
    } else if (isNotNullish(setting.min) && integerValue < setting.min) {
      integerValue = setting.min
    } else {
      integerValue = Math.floor(integerValue)
    }
  }
  
</script>