<TextField
  bind:this={textField}
  minWidth={50}
  onBlur={handleTextFieldEvent}
  onFocus={handleTextFieldEvent}
  onKeyDown={handleTextFieldEvent}
  onKeyPress={handleTextFieldEvent}
  title={title}
  type="text"
  bind:value={filter}
/>
<div
  bind:this={optionsContainer}
  style:position="absolute"
  style:display="none"
  style:overflow="scroll"
  style:z-index="1"
  style:box-shadow="0px 5px 5px -3px rgba(0, 0, 0, 0.3), 0px 8px 10px 1px rgba(0, 0, 0, 0.3), 0px 3px 14px 2px rgba(0, 0, 0, 0.3)"
  style:background-color={colors.primarySurface}
>
  <Stack
    alignment="fill"
    direction="vertical"
    distribution="start"
  >
    {#each filteredOptions as option, index (option.id)}
      {#snippet descriptionTooltip()}
        <TextTooltip text={option.description!}/>
      {/snippet}
      
      <div
        bind:this={optionElements[option.id]}
        style:cursor="pointer"
        style:color={index === highlightedOptionIndex ? colors.primaryTint : colors.text}
        style:background-color={index === highlightedOptionIndex ? colors.secondarySurface : colors.primarySurface}
        data-index={index}
        onclick={handleOptionElementEvent}
        onkeypress={handleOptionElementEvent}
        onmouseenter={handleOptionElementEvent}
        role="button"
        tabindex="0"
        use:tooltip={isNotNullish(option.description) ? descriptionTooltip : undefined}
      >
        <Stack
          alignment="fill"
          direction="horizontal"
          distribution="fill"
          padding={10}
        >
          {option.name}
        </Stack>
      </div>
    {:else}
      <Stack
        alignment="fill"
        direction="horizontal"
        distribution="fill"
        padding={10}
      >
        <div use:textStyle={"item"}>
          No matches found.
        </div>
      </Stack>
    {/each}
  </Stack>
</div>

<script
  lang="ts"
  module
>
  export type Option = {
    id: string
    name: string
    description?: string
    keywords: string
    value: any
  }
  
  export const optionFrom = (value: {
    id: string
    name: string
    description?: string
  }): Option => {
    return {
      ...value,
      keywords: value.name,
      value: value.id,
    }
  }
  
</script>

<script lang="ts">
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { autoUpdate, computePosition, flip, type Placement, size } from "@floating-ui/dom"
  import { colors } from "@scripts/colors"
  import { textStyle } from "@scripts/textStyle"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { onDestroy } from "svelte"
  
  type Props = {
    title: string | undefined
    options: Option[]
    clearOnFocus: boolean
    clearOnSelect: boolean
    restoreOnBlur: boolean
    filter?: string
    previousSelection?: Option
    onSelect: (optionId: string | undefined) => void
  }
  
  /* eslint-disable prefer-const */
  let {
    title,
    options,
    clearOnFocus,
    clearOnSelect,
    restoreOnBlur,
    filter = $bindable(""),
    previousSelection = $bindable(),
    onSelect,
  }: Props = $props()
  /* eslint-enable prefer-const */
  
  let textField: TextField<string, "text">
  let optionsContainer: HTMLElement
  const optionElements: Record<string, HTMLDivElement> = $state({})
  
  let hoveredOptionIndex: number | undefined = $state()
  let optionsPlacement: Placement | undefined
  let removeOptionsContainerAutoUpdates: (() => void) | undefined
  
  const filteredOptions: Option[] = $derived.by(() => {
    return options.filter((option) => {
      return option.keywords.toLowerCase().includes(filter.toLowerCase())
    })
  })
  
  const highlightedOptionIndex: number = $derived.by(() => {
    if (isNotNullish(hoveredOptionIndex)) {
      return hoveredOptionIndex
    }
    
    const index = filteredOptions.findIndex((option) => {
      return option.id === previousSelection?.id
    })
    
    return index === -1 ? 0 : index
  })
  
  onDestroy(() => {
    removeOptionsContainerAutoUpdates?.()
    removeOptionsContainerAutoUpdates = undefined
  })
  
  const showOptions = () => {
    updateOptionsLayout()
    optionsContainer.style.display = "block"
    optionsContainer.scroll({ top: 0, behavior: "instant" }) // Needs to happen after changing the display style.
    removeOptionsContainerAutoUpdates?.()
    removeOptionsContainerAutoUpdates = autoUpdate(
      textField.getElement(),
      optionsContainer,
      async () => { await updateOptionsLayout() },
      {
        elementResize: false,
      }
    )
  }
  
  const hideOptions = () => {
    hoveredOptionIndex = undefined
    optionsContainer.style.display = "none"
    optionsPlacement = undefined
    removeOptionsContainerAutoUpdates?.()
    removeOptionsContainerAutoUpdates = undefined
  }
  
  const selectOption = (option: Option | undefined) => {
    hideOptions()
    
    if (clearOnSelect) {
      filter = ""
      previousSelection = undefined
    } else {
      filter = option?.name ?? ""
      previousSelection = option
    }
    
    hoveredOptionIndex = undefined
    
    onSelect(option?.id)
  }
  
  const updateOptionsLayout = async (placement?: Placement) => {
    const position = await computePosition(textField.getElement(), optionsContainer, {
      placement: placement ?? "bottom-start",
      middleware: [
        ...isNullish(placement) ? [flip()] : [],
        size({
          apply({ availableWidth, availableHeight, rects, elements }) {
            elements.floating.style.maxWidth = `${availableWidth}px`
            elements.floating.style.maxHeight = availableHeight >= elements.floating.scrollHeight ? "" : `${availableHeight - 15}px`
            elements.floating.style.minWidth = `${rects.reference.width}px`
          },
        }),
      ],
    })
    
    optionsContainer.style.left = `${position.x}px`
    optionsContainer.style.top = `${position.y}px`
    optionsPlacement = position.placement
  }
  
  const handleTextFieldEvent = (event: Event) => {
    if (event.type === "focus") {
      if (clearOnFocus) {
        filter = ""
      }
    
      showOptions()
    } else if (
      event.type === "blur"
      && event instanceof FocusEvent
      && (
        isNullish(event.relatedTarget)
        || event.relatedTarget instanceof HTMLDivElement && Object.values(optionElements).indexOf(event.relatedTarget) === -1
      )
    ) {
      hideOptions()
      
      if (restoreOnBlur && isNotNullish(previousSelection)) {
        selectOption(previousSelection)
      } else {
        selectOption(options.find((option) => { return option.keywords.toLowerCase() === filter.toLowerCase() }))
      }
    } else if (event.type === "keydown" && event instanceof KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault()
      
        if (isNullish(highlightedOptionIndex) || highlightedOptionIndex === filteredOptions.length - 1) {
          hoveredOptionIndex = 0
        } else {
          hoveredOptionIndex = highlightedOptionIndex + 1
        }
      
        optionElements[filteredOptions[highlightedOptionIndex].id]?.scrollIntoView({ block: "nearest" })
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
      
        if (isNullish(highlightedOptionIndex) || highlightedOptionIndex === 0) {
          hoveredOptionIndex = filteredOptions.length - 1
        } else {
          hoveredOptionIndex = highlightedOptionIndex - 1
        }
      
        optionElements[filteredOptions[highlightedOptionIndex].id]?.scrollIntoView({ block: "nearest" })
      }
    } else if (event.type === "keypress" && event instanceof KeyboardEvent) {
      if (event.key === "Enter" && isNotNullish(highlightedOptionIndex)) {
        const element = optionElements[filteredOptions[highlightedOptionIndex].id]
        element?.focus()
        element?.click()
      }
    }
  }
  
  const handleOptionElementEvent = (event: Event) => {
    if (!(event.currentTarget instanceof HTMLElement) || isNullish(event.currentTarget.dataset.index)) {
      return
    }
    
    const index = parseInt(event.currentTarget.dataset.index)
    
    if (isNaN(index)) {
      return
    }
    
    if (event.type === "mouseenter") {
      hoveredOptionIndex = index
    } else if (event.type === "keypress" && event instanceof KeyboardEvent && event.key === "Enter") {
      selectOption(filteredOptions[index])
    } else if (event.type === "click") {
      selectOption(filteredOptions[index])
    }
  }
  
  $effect(() => { filter; filterListener() })
  const filterListener = () => {
    updateOptionsLayout(optionsPlacement)
  }
  
</script>