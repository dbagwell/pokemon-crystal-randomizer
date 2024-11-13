<div bind:this={container}>
  {@render children()}
</div>

<script lang="ts">
  import { isNotNullish, isNumber } from "@shared/utils"
  import { onMount, type Snippet } from "svelte"
  
  const directionMap = {
    vertical: "column",
    horizontal: "row",
  }
  
  const alignmentMap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    fill: "stretch",
  }
  
  const distributionMap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    fill: "space-between",
  }
  
  type Props = {
    direction: keyof typeof directionMap
    alignment: keyof typeof alignmentMap
    distribution: keyof typeof distributionMap
    minSpacing?: number
    padding?: number | [number, number] | [number, number, number, number]
    wrap?: boolean
    width?: string
    height?: string
    minWidth?: string
    minHeight?: string
    children: Snippet
  }
  
  const {
    direction,
    alignment,
    distribution,
    minSpacing = 0,
    padding = 0,
    wrap = false,
    width,
    height,
    minWidth,
    minHeight,
    children,
  }: Props = $props()
  
  let container: HTMLDivElement
  
  onMount(() => {
    container.style.display = "flex"
    container.style.flexDirection = directionMap[direction]
    container.style.alignItems = alignmentMap[alignment]
    container.style.justifyContent = distributionMap[distribution]
    container.style.gap = `${minSpacing}px`
    container.style.flexWrap = wrap ? "wrap" : "nowrap"
    container.style.padding = (isNumber(padding) ? [padding] : padding).map((value) => {
      return `${value}px`
    }).join(" ")
    
    if (isNotNullish(width)) {
      container.style.width = width
    }
    
    if (isNotNullish(height)) {
      container.style.height = height
    }
    
    if (isNotNullish(minWidth)) {
      container.style.minWidth = minWidth
    }
    
    if (isNotNullish(minHeight)) {
      container.style.minHeight = minHeight
    }
  })
  
</script>