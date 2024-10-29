<div bind:this={container}>
  <Stack
    alignment="center"
    direction="vertical"
    distribution="end"
    minSpacing={3}
    minWidth="{minWidth ?? 0}px"
    padding={[isNotNullish(title) ? 12.25 : 0, 0, 0, 0]}
    width="{width ?? 150}px"
  >
    <div
      style:position="relative"
      style:width="100%">
      <input
        bind:this={input}
        style:border-style="none"
        style:background-color="transparent"
        style:color={colors.text}
        style:font-size="15px"
        style:outline="none"
        style:padding="0"
        style:margin="0"
        style:width="100%"
        max={max}
        min={min}
        type={type}
        value={value}
        on:focus={onFocus}
        on:blur={onBlur}
        on:input={onInput}
      />
      {#if isNotNullish(title)}
        <div
          bind:this={titleDiv}
          style:position="absolute"
          style:transition="all 0.25s"
          style:transform-origin="bottom left"
          style:bottom="0px"
          style:color={colors.inactiveTint}
          style:font-size="15"
          style:white-space="nowrap"
          style:overflow="hidden"
          style:text-overflow="ellipsis"
          style:width="100%"
          style:pointer-events="none"
        >
          {title}
        </div>
      {/if}
    </div>
    <div
      style:background-color={isFocused() ? colors.activeTint : colors.inactiveTint}
      style:height="2px"
      style:width="100%"
    >
  </Stack>
</div>

<script
  generics="ValueType extends number | string, TypeType extends ValueType extends number ? 'number' : 'text'"
  lang="ts"
>

  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { createEventDispatcher, onMount } from "svelte"

  export let title: string | undefined = undefined
  export let value: ValueType | undefined = undefined
  export let type: TypeType
  export let min: number = Number.NaN
  export let max: number = Number.NaN
  export let width: number | undefined = undefined
  export let minWidth: number | undefined = undefined
  
  let _isFocused = false
  export const isFocused = () => {
    return _isFocused
  }
  
  export const getElement = () => {
    return container
  }
  
  let isMounted = false
  let container: HTMLElement
  let input: HTMLInputElement
  let titleDiv: HTMLElement
  
  const dispath = createEventDispatcher()
  
  onMount(() => {
    isMounted = true
    updateStyle()
  })
  
  const updateStyle = () => {
    if (isNotNullish(title)) {
      if (isFocused()) {
        titleDiv.style.color = colors.activeTint
      } else {
        titleDiv.style.color = colors.inactiveTint
      }
      
      if ((isNullish(value) || value === "" || Number.isNaN(value)) && !isFocused()) {
        titleDiv.style.bottom = "0px"
        titleDiv.style.transform = "scale(1)"
        titleDiv.style.width = "100%"
      } else {
        titleDiv.style.bottom = "20px"
        titleDiv.style.transform = "scale(0.7)"
        titleDiv.style.width = "130%"
      }
    }
  }
  
  const onInput = () => {
    if (type === "number") {
      if (Number.isNaN(input.value)) {
        value = undefined
      } else {
        value = parseInt(input.value) as ValueType
      }
    } else {
      value = input.value as ValueType
    }
  }
  
  const onFocus = (event: Event) => {
    _isFocused = true
    updateStyle()
    dispath("focus", event)
  }
  
  const onBlur = (event: Event) => {
    _isFocused = false
    updateStyle()
    dispath("blur", event)
  }
  
  $: value, valueListener()
  const valueListener = () => {
    if (isMounted) {
      updateStyle()
    }
  }
</script>