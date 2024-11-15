<button
  bind:this={container}
  style:flex-grow={flexGrow ? "1" : ""}
  onclick={handleClickEvent}
  onmousedown={handleMouseDownEvent}
  onmouseenter={handleMouseEnterEvent}
  onmouseleave={handleMouseLeaveEvent}
  onmouseup={handleMouseUpEvent}
>
  <Stack
    alignment="center"
    direction="horizontal"
    distribution="center"
    height="100%"
    padding={style === "fill" ? [0, 15, 0, 15] : 0}
  >
    <div
      bind:this={textContainer}
      style:text-align="center"
    >
      {title}
    </div>
  </Stack>
</button>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { onMount } from "svelte"
  
  type Props = {
    style: "fill" | "icon"
    isDestructive?: boolean
    title: string
    flexGrow?: boolean
    isDisabled?: boolean
    onClick: () => void
  }
  
  const {
    style,
    isDestructive = false,
    title,
    flexGrow = false,
    isDisabled = $bindable(false),
    onClick,
  }: Props = $props()
  
  let container: HTMLElement
  let textContainer: HTMLElement
  let isActive = false
  let isHovered = false
  
  onMount(() => {
    updateStyle()
  })
  
  const handleClickEvent = (event: Event) => {
    event.preventDefault()
    
    if (!isDisabled) {
      onClick()
    }
  }
  
  const handleMouseEnterEvent = () => {
    isHovered = true
    isActive = container.matches.call(container, ":active")
    updateStyle()
  }
  
  const handleMouseDownEvent = () => {
    isActive = true
    updateStyle()
  }
  
  const handleMouseUpEvent = () => {
    isActive = false
    updateStyle()
  }
  
  const handleMouseLeaveEvent = () => {
    isHovered = false
    isActive = false
    updateStyle()
  }
  
  const updateStyle = () => {
    container.style.opacity = isActive || isDisabled ? "0.2" : "1"
    container.style.cursor = isDisabled ? "default" : "pointer"
      
    switch (style) {
    case "fill": {
      container.style.backgroundColor = isDestructive ? colors.destructiveTint : colors.primaryTint
      container.style.borderStyle = "solid"
      container.style.borderWidth = "3px"
      container.style.borderColor = isHovered && !isDisabled
        ? isDestructive ? colors.secondaryDestructiveTint : colors.secondaryTint
        : isDestructive ? colors.destructiveTint : colors.primaryTint
      container.style.height = "44px"
      container.style.borderRadius = "10px"
      container.style.boxShadow = "2px 2px 5px #00000070"
      textContainer.style.fontSize = "20px"
      textContainer.style.color = colors.buttonText
      textContainer.className = ""
      return
    }
    case "icon": {
      container.style.backgroundColor = "transparent"
      container.style.borderStyle = "none"
      container.style.borderWidth = "0px"
      container.style.borderColor = "transparent"
      container.style.height = ""
      container.style.borderRadius = ""
      container.style.boxShadow = ""
      textContainer.style.fontSize = "16px"
      textContainer.style.color = isHovered && !isDisabled
        ? isDestructive ? colors.destructiveTint : colors.primaryTint
        : colors.inactiveTint
      textContainer.className = "material-icons"
    }
    }
  }
  
  $effect(() => { isDisabled; isDisabledListener() })
  const isDisabledListener = () => {
    updateStyle()
  }
</script>