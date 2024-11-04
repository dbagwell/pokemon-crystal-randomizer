<div
  bind:this={container}
  style:cursor="pointer"
  style:flex-grow={flexGrow ? "1" : ""}
  on:click|preventDefault={onClick}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:mouseleave={onMouseLeave}
  on:mouseenter={onMouseEnter}
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
</div>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { onMount } from "svelte"
  
  export let style: "fill" | "icon"
  export let isDestructive = false
  export let title: string
  export let flexGrow = false
  export let onClick: () => void
  
  let container: HTMLElement
  let textContainer: HTMLElement
  let isActive = false
  let isHovered = false
  
  onMount(() => {
    updateStyle()
  })
  
  const onMouseEnter = () => {
    isHovered = true
    isActive = container.matches.call(container, ":active")
    updateStyle()
  }
  
  const onMouseDown = () => {
    isActive = true
    updateStyle()
  }
  
  const onMouseUp = () => {
    isActive = false
    updateStyle()
  }
  
  const onMouseLeave = () => {
    isHovered = false
    isActive = false
    updateStyle()
  }
  
  const updateStyle = () => {
    container.style.opacity = isActive ? "0.2" : "1"
      
    switch (style) {
    case "fill": {
      container.style.backgroundColor = isDestructive ? colors.destructiveTint : colors.primaryButtonBackground
      container.style.borderStyle = "solid"
      container.style.borderWidth = "3px"
      container.style.borderColor = isHovered
        ? isDestructive ? colors.destructiveHighlight : colors.primaryButtonHighlightedBackground
        : isDestructive ? colors.destructiveTint : colors.primaryButtonBackground
      container.style.height = "44px"
      container.style.borderRadius = "10px"
      container.style.boxShadow = "2px 2px 5px #00000070"
      textContainer.style.fontSize = "20px"
      textContainer.style.color = colors.primaryButtonForeground
      textContainer.className = ""
      return
    }
    case "icon": {
      container.style.backgroundColor = ""
      container.style.borderStyle = ""
      container.style.borderWidth = ""
      container.style.borderColor = ""
      container.style.height = ""
      container.style.borderRadius = ""
      container.style.boxShadow = ""
      textContainer.style.fontSize = "16px"
      textContainer.style.color = isHovered
        ? isDestructive ? colors.destructiveTint : colors.activeTint
        : colors.inactiveTint
      textContainer.className = "material-icons"
    }
    }
  }
</script>