<div
  bind:this={container}
  style:background-color={style === "fill" ? colors.primaryButtonBackground : ""}
  style:border-style={style === "fill" ? "solid" : ""}
  style:border-width={style === "fill" ? "3px" : ""}
  style:border-color={style === "fill" ? colors.primaryButtonBackground : ""}
  style:height={style === "fill" ? "44px" : ""}
  style:border-radius={style === "fill" ? "10px" : ""}
  style:box-shadow={style === "fill" ? "2px 2px 5px #00000070" : ""}
  style:cursor="pointer"
  on:click={onClick}
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
      style:font-size="{style === "fill" ? 20 : 16}px"
      style:color={style === "fill" ? colors.primaryButtonForeground : colors.inactiveTint}
      class={style === "fill" ? "" : "material-icons"}
    >
      {title}
    </div>
  </Stack>
</div>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  
  export let style: "fill" | "icon"
  export let isDestructive = false
  export let title: string
  export let onClick: () => void
  
  let container: HTMLElement
  let textContainer: HTMLElement
  
  const onMouseEnter = () => {
    if (style === "fill") {
      container.style.borderColor = colors.primaryButtonHighlightedBackground
    } else if (style === "icon") {
      textContainer.style.color = isDestructive ? colors.activeTint : colors.destructiveTint
    }
    
    container.style.opacity = container.matches.call(container, ":active") ? "0.2" : "1"
  }
  
  const onMouseDown = () => {
    container.style.opacity = "0.2"
  }
  
  const onMouseUp = () => {
    container.style.opacity = "1"
  }
  
  const onMouseLeave = () => {
    container.style.opacity = "1"
    
    if (style === "fill") {
      container.style.borderColor = colors.primaryButtonBackground
    } else if (style === "icon") {
      textContainer.style.color = colors.inactiveTint
    }
  }
</script>