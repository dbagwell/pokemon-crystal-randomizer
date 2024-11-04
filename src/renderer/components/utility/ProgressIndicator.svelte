<div
  style:display={display}
  style:position="fixed"
  style:inset="0"
  style:width="100%"
  style:height="100%"
  style:background-color="#00000055"
  style:backdrop-filter="blur(10px)"
  style:z-index={zIndexes.progressIndicatorLayer}
>
  <div
    style:display="flex"
    style:align-items="center"
    style:justify-content="center"
    style:height="100%"
  >
    <div
      style:width="100px"
      style:height="100px"
      style:position="absolute"
    >
      {#each indicatorColors as indicatorColor, index (index)}
        <div
          bind:this={indicators[index]}
          style:width="100%"
          style:height="100%"
          style:border-width="10px"
          style:border-style="solid"
          style:border-color={indicatorColor}
          style:border-radius="50%"
          style:position="absolute"
          style:top="0"
          style:left="0"
        >
        </div>
      {/each}
    </div>
  </div>
</div>

<script lang="ts">
  import { colors } from "@scripts/colors"
  import { zIndexes } from "@scripts/constants"
  import { onMount } from "svelte"
  
  const indicatorColors = [
    colors.progressIndicatorHighlight,
    `${colors.progressIndicator} ${colors.progressIndicator} transparent transparent`,
    `transparent transparent ${colors.progressIndicator} ${colors.progressIndicator}`,
  ]
  
  const indicators: HTMLElement[] = []
  let display = "none"
  
  onMount(() => {
    indicators[1].animate({
      transform: ["rotate(0deg)", "rotate(360deg)", "rotate(540deg)", "rotate(720deg)"],
    }, {
      duration: 1500,
      iterations: Infinity,
    })
    indicators[2].animate({
      transform: ["rotate(0deg)", "rotate(270deg)", "rotate(450deg)", "rotate(720deg)"],
    }, {
      duration: 1500,
      iterations: Infinity,
    })
  })
  
  showProgressIndicator = () => {
    display = "block"
  }
  
  hideProgressIndicator = () => {
    display = "none"
  }
</script>

<script
  context="module"
  lang="ts"
>
  
  export let showProgressIndicator: () => void
  export let hideProgressIndicator: () => void

</script>