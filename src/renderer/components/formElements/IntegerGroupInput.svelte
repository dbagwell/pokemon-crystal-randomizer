{config.label}
<Stack
  alignment="start"
  direction="horizontal"
  distribution="start"
  minSpacing={10}
  padding={[0, 0, 0, 0]}
  wrap={true}
>
  {#each values as value, index (index)}
    <Textfield
      bind:this={textfields[index]}
      input$max={config.max}
      input$min={config.min}
      type="number"
      bind:value={value}
      on:blur={textFieldBlurHandler}
      on:focus={() => { textFieldFocusHandler(index) }}
    />
  {/each}
</Stack>
<!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { isNotNullish, isNullish } from "@shared/utils"
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let config: IntegerGroupInputConfig
  
  const textfields: Textfield[] = []
  
  let oldValues: number[] = []
  let values: number[] = []
  let currentIndex: number | null = null
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    hasMounted = true
  })

  const textFieldFocusHandler = (index: number) => {
    if (isNullish(currentIndex)) {
      oldValues = values.map((value) => { return value })
    }
    currentIndex = index
  }

  const textFieldBlurHandler = () => {
    requestAnimationFrame(() => {
      if (isNullish(textfields.find((textfield) => { return textfield.input.getElement() === document.activeElement }))) {
        if (isNotNullish(error)) {
          values = oldValues
          showErrorDialog(error)
        }
        
        currentIndex = null
      }
    })
  }

  $: values, valuesListener()
  const valuesListener = () => {
    if (!hasMounted) {
      return
    }
    
    let foundNewError = false
    
    values.forEach((value) => {
      if (Number.isNaN(value)) {
        error = `All ${config.label} values are required.`
        foundNewError = true
      } else if (!Number.isInteger(value)) {
        error = `All ${config.label} values must be integers.`
        foundNewError = true
      } else if (isNotNullish(config.min) && value < config.min) {
        error = `All ${config.label} values must be greater than or equal to ${config.min}.`
        foundNewError = true
      } else if (isNotNullish(config.max) && value > config.max) {
        error = `All ${config.label} values must be less than or equal to ${config.max}.`
        foundNewError = true
      }
    })
    
    if (!foundNewError && isNotNullish(config.sum) && values.reduce((result, value) => { return result + value }, 0) !== config.sum) {
      error = `All ${config.label} values must add up to ${config.sum}.`
      foundNewError = true
    }
    
    if (!foundNewError) {
      config.values = values.map((value) => { return value })
      error = null
    }
  }

  $: config.values, configValuesListener()
  const configValuesListener = () => {
    values = config.values.map((value) => { return value })
  }
</script>