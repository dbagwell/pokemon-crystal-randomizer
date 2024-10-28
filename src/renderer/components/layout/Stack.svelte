<div bind:this={container}>
  <slot/>
</div>

<script lang="ts">
  import { isNotNullish, isNumber } from "@shared/utils"
  import { onMount } from "svelte"
  
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

  export let direction: keyof typeof directionMap
  export let alignment: keyof typeof alignmentMap
  export let distribution: keyof typeof distributionMap
  export let minSpacing: number = 0
  export let padding: number | [number, number] | [number, number, number, number] = 0
  export let wrap = false
  export let width: string | undefined = undefined
  export let height: string | undefined = undefined
  export let minWidth: string | undefined = undefined
  export let minHeight: string | undefined = undefined
  
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