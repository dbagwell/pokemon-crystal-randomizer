<div bind:this={container}>
  <slot/>
</div>

<script lang="ts">
  import { isNumber } from "@shared/utils"
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
  })
  
</script>