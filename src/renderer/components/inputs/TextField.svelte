<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={container}
  onclick={handleClickEvent}
  onmouseenter={handleMouseEnterEvent}
  onmouseleave={handleMouseLeaveEvent}
>
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
        onblur={handleBlurEvent}
        onfocus={handleFocusEvent}
        oninput={handleInputEvent}
        onkeydown={handleKeyDownEvent}
        onkeypress={handleKeyPressEvent}
        type={type}
        value={value}
      />
      {#if isNotNullish(title)}
        <div
          bind:this={titleDiv}
          style:position="absolute"
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
      style:background-color={isHovered || isFocused ? colors.primaryTint : colors.inactiveTint}
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
  
  type Props = {
    title?: string
    value?: ValueType
    type: TypeType
    min?: number
    max?: number
    width?: number
    minWidth?: number
    onFocus?: (event: Event) => void
    onBlur?: (event: Event) => void
    onKeyDown?: (event: Event) => void
    onKeyPress?: (event: Event) => void
  }
  
  /* eslint-disable prefer-const */
  let {
    title,
    value = $bindable(),
    type,
    min = Number.NaN,
    max = Number.NaN,
    width,
    minWidth,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyPress,
  }: Props = $props()
  /* eslint-enable prefer-const */
  
  let isFocused = $state(false)
  export const getIsFocused = () => {
    return isFocused
  }
  
  export const getElement = () => {
    return container
  }
  
  let hasSetInitialStyle = false
  let container: HTMLElement
  let input: HTMLInputElement
  let titleDiv: HTMLElement | undefined = $state()
  let isHovered = $state(false)
  
  const updateStyle = () => {
    if (isNotNullish(titleDiv)) {
      if (isFocused) {
        titleDiv.style.color = colors.primaryTint
      } else {
        titleDiv.style.color = colors.inactiveTint
      }
      
      if ((isNullish(value) || value === "" || Number.isNaN(value)) && !isFocused) {
        titleDiv.style.bottom = "0px"
        titleDiv.style.transform = "scale(1)"
        titleDiv.style.width = "100%"
      } else {
        titleDiv.style.bottom = "20px"
        titleDiv.style.transform = "scale(0.7)"
        titleDiv.style.width = "130%"
      }
      
      if (hasSetInitialStyle) {
        titleDiv.style.transition = "all 0.25s"
      }
    }
    
    hasSetInitialStyle = true
  }
  
  const handleInputEvent = () => {
    if (type === "number") {
      if (Number.isNaN(input.value) || isNullish(input.value)) {
        value = undefined
      } else {
        value = input.value as ValueType
        setTimeout(() => {
          value = parseInt(input.value) as ValueType
        }, 1)
      }
    } else {
      value = input.value as ValueType
    }
  }
  
  const handleMouseEnterEvent = () => {
    isHovered = true
  }
  
  const handleMouseLeaveEvent = () => {
    isHovered = false
  }
  
  const handleFocusEvent = (event: Event) => {
    isFocused = true
    updateStyle()
    onFocus?.(event)
  }
  
  const handleBlurEvent = (event: Event) => {
    isFocused = false
    updateStyle()
    onBlur?.(event)
  }
  
  const handleKeyDownEvent = (event: Event) => {
    onKeyDown?.(event)
  }
  
  const handleKeyPressEvent = (event: Event) => {
    onKeyPress?.(event)
  }
  
  const handleClickEvent = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    input.focus()
  }
  
  $effect(() => { value; valueListener() })
  const valueListener = () => {
    updateStyle()
  }
</script>