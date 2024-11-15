<div
  bind:this={tooltipContainer}
  style:position="absolute"
  style:display="none"
  style:z-index="1"
  style:box-shadow="0px 5px 5px -3px rgba(0, 0, 0, 0.3), 0px 8px 10px 1px rgba(0, 0, 0, 0.3), 0px 3px 14px 2px rgba(0, 0, 0, 0.3)"
  onmouseleave={handleMouseLeaveEvent}
>
  <div
    bind:this={arrowElement}
    style:position="absolute"
    style:background-color={colors.secondarySurface}
    style:transform="rotate(45deg)"
    style:width="14px"
    style:height="14px"
  >
  </div>
  <div
    style:background-color={colors.secondarySurface}
    style:color={colors.text}
    style:padding="10px"
    style:top="0px"
    style:left="0px"
    style:width="100%"
    style:height="100%"
    style:overflow="scroll"
  >
    {#if isNotNullish(tooltipContent)}
      {@render tooltipContent()}
    {/if}
  </div>
</div>

<script lang="ts">
  import { arrow, autoUpdate, computePosition, flip, offset, size } from "@floating-ui/dom"
  import { colors } from "@scripts/colors"
  import { isNotNullish, isNullish } from "@shared/utils"
  import type { Snippet } from "svelte"

  let anchorElement: HTMLElement | undefined
  let tooltipContainer: HTMLElement
  let arrowElement: HTMLElement
  let tooltipContent: Snippet | undefined = $state()
  let currentTooltipId: string | undefined
  let removeTooltipAutoUpdates: (() => void) | undefined
  
  const updateTooltipLayout = async () => {
    if (isNullish(anchorElement)) {
      return
    }
    
    const position = await computePosition(anchorElement, tooltipContainer, {
      placement: "right",
      middleware: [
        offset({ mainAxis: 15 }),
        flip(),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            elements.floating.style.maxWidth = `${Math.min(availableWidth, 300)}px`
            elements.floating.style.maxHeight = `${availableHeight - 15}px`
          },
        }),
        arrow({ element: arrowElement }),
      ],
    })
    
    tooltipContainer.style.left = `${position.x}px`
    tooltipContainer.style.top = `${position.y}px`
    arrowElement.style.left = position.placement === "right" ? "-7px" : "calc(100% - 7px)"
    arrowElement.style.top = `${position.middlewareData.arrow!.y}px`
  }
  
  const handleMouseLeaveEvent = () => {
    const id = currentTooltipId
    if (isNotNullish(id)) {
      setTimeout(() => {
        if (anchorElement?.matches(":hover") !== true && tooltipContainer.matches(":hover") !== true) {
          hideTooltip(id)
        }
      }, 300)
    }
  }
  
  showTooltip = (id: string, content: Snippet, target: HTMLElement): HTMLElement => {
    currentTooltipId = id
    anchorElement = target
    tooltipContent = content
    updateTooltipLayout()
    tooltipContainer.style.display = "block"
    removeTooltipAutoUpdates?.()
    removeTooltipAutoUpdates = autoUpdate(
      anchorElement,
      tooltipContainer,
      updateTooltipLayout,
    )
    return tooltipContainer
  }
  
  hideTooltip = (id: string) => {
    if (currentTooltipId !== id) {
      return
    }
    
    removeTooltipAutoUpdates?.()
    removeTooltipAutoUpdates = undefined
    anchorElement = undefined
    tooltipContainer.style.display = "none"
  }
</script>

<script
  lang="ts"
  module
>
  const tooltips: Partial<Record<string, HTMLElement>> = {}
  
  let showTooltip: (id: string, content: Snippet, target: HTMLElement) => HTMLElement
  let hideTooltip: (id: string) => void
  
  export const tooltip = (element: HTMLElement, content: Snippet | undefined) => {
    if (isNullish(content)) {
      return
    }
    
    element.id = crypto.randomUUID()
    
    element.onmouseenter = () => {
      setTimeout(() => {
        if (element.matches(":hover") === true || tooltips[element.id]?.matches(":hover") === true) {
          tooltips[element.id] = showTooltip(element.id, content, element)
        }
      }, 500)
    }
      
    element.onmouseleave = () => {
      setTimeout(() => {
        if (element.matches(":hover") !== true && tooltips[element.id]?.matches(":hover") !== true) {
          hideTooltip(element.id)
          tooltips[element.id] = undefined
        }
      }, 300)
    }
  }

</script>