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
  
    {#if setting.type === "selection"}
      <Autocomplete
        bind:this={autocompleteTextField}
        getOptionLabel={getValueName}
        label={setting.title}
        options={availableValues}
        selectOnExactMatch={false}
        bind:value={autocompleteValue}
        on:SMUIAutocomplete:selected={handleAutocompleteSelection}
      />
    {/if}
  
    {#if isNotNullish(setting.description) || setting.type === "selection" && isNotNullish(setting.values) && setting.values.find((value) => { return isNotNullish(value.description) })}
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
          {#if setting.type === "selection" && isNotNullish(setting.values)}
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
  import { Icon } from "@smui/common"
  import Textfield from "@smui/textfield"
  import Tooltip, { Content, Title, Wrapper } from "@smui/tooltip"
  import Autocomplete from "@smui-extra/autocomplete"
  import { isNotNullish, isNumber, isString } from "@utils"
  
  export let setting: Setting
  
  export const setValue = (value: any) => {
    switch (setting.type) {
    case "integer": {
      if (isNumber(value) && Number.isInteger(value)) {
        integerValue = value
      }
      break
    }
    case "selection": {
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
            
            selectValue(selectedValue)
          }
        })
      }
      
      break
    }
    }
  }
  
  export const getValue = (): any => {
    switch (setting.type) {
    case "integer": {
      return integerValue
    }
    case "selection": {
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
        return null
      }
    }
    }
  }
  
  let autocompleteTextField: Autocomplete
  const selectedValuesInputs: Dictionary<any> = {} // Unfortunately I think this needs to be any because we can't reference our own type
  
  let autocompleteValue: SelectionSettingValue | undefined = undefined // Not really used but required to prevent errors
  let availableValues = setting.type === "selection" ? setting.values : []
  let selectedValues: SelectionSettingValue[] = []
  let integerValue = setting.type === "integer" ? setting.preset ?? setting.default : 0
  
  const handleAutocompleteSelection = (event: CustomEvent<SelectionSettingValue>) => {
    event.preventDefault()
    autocompleteTextField.text = ""
    selectValue(event.detail)
  }
  
  const selectValue = (value: SelectionSettingValue) => {
    if (setting.type !== "selection") { return }
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
  
  const getValueName = (value: SelectionSettingValue) => {
    if (isNotNullish(value)) {
      return value.name
    } else {
      return ""
    }
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