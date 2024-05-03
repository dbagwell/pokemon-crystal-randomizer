<Textfield
  bind:this={textField}
  style="min-width: 50px;"
  label={label}
  bind:value={filter}
  on:focus={handleTextFieldEvent}
  on:blur={handleTextFieldEvent}
  on:keydown={handleTextFieldEvent}
  on:keypress={handleTextFieldEvent}
/>
<div
  bind:this={optionsContainer}
  style:position="absolute"
  style:display="none"
  style:overflow="scroll"
  style:z-index="1"
  class="surface elevated"
>
  <Stack
    alignment="fill"
    direction="vertical"
    distribution="start"
  >
    {#each filteredOptions as option, index (option.id)}
      <div
        bind:this={optionElements[option.id]}
        style:cursor="pointer"
        class={index === highlightedOptionIndex ? "highlighted" : ""}
        data-index={index}
        role="button"
        tabindex="0"
        on:mouseenter={handleOptionElementEvent}
        on:keypress={handleOptionElementEvent}
        on:click={handleOptionElementEvent}
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
        No matches found.
      </Stack>
    {/each}
  </Stack>
</div>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { computePosition, flip, size } from "@floating-ui/dom"
  import { isNotNullish, isNullish } from "@shared/utils"
  import Textfield from "@smui/textfield"
  import { createEventDispatcher } from "svelte"
  
  type Option = {
    id: string,
    name: string,
    keywords: string,
    value: any,
  }
  
  export let label: string
  export let options: Option[]
  export let clearOnFocus: boolean
  export let clearOnSelect: boolean
  export let restoreOnBlur: boolean
  export let filter = ""
  export let previousSelection: Option | undefined = undefined
  
  let textField: Textfield
  let optionsContainer: HTMLElement
  const optionElements: Record<string, HTMLDivElement> = {}
  
  const dispath = createEventDispatcher()
  
  let filteredOptions: Option[]
  let highlightedOptionIndex: number = 0
  
  const showOptions = () => {
    updateOptionsLayout()
    optionsContainer.style.display = "block"
    optionsContainer.scroll({ top: 0, behavior: "instant" }) // Needs to happen after changing the display style.
  }
  
  const hideOptions = () => {
    highlightedOptionIndex = 0
    optionsContainer.style.display = "none"
  }
  
  const selectOption = (option: Option | undefined) => {
    optionsContainer.style.display = "none"
    if (clearOnSelect) {
      filter = ""
    } else {
      filter = option?.name ?? ""
    }
    
    previousSelection = option
    
    dispath("select", option?.id)
  }
  
  const updateOptionsLayout = async () => {
    const position = await computePosition(textField.getElement(), optionsContainer, {
      placement: "bottom-start",
      middleware: [
        flip(),
        size({
          apply({ availableWidth, availableHeight, rects, elements }) {
            elements.floating.style.maxWidth = `${availableWidth}px`
            elements.floating.style.maxHeight = `${availableHeight - 15}px`
            elements.floating.style.minWidth = `${rects.reference.width}px`
          },
        }),
      ],
    })
    
    optionsContainer.style.left = `${position.x}px`
    optionsContainer.style.top = `${position.y}px`
  }
  
  const handleTextFieldEvent = (event: Event) => {
    if (event.type === "focus") {
      if (clearOnFocus) {
        filter = ""
      }
    
      showOptions()
    } else if (
      event.type === "blur" && event instanceof CustomEvent
        && (isNullish(event.detail.relatedTarget) || Object.values(optionElements).indexOf(event.detail.relatedTarget) === -1)
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
          highlightedOptionIndex = 0
        } else {
          highlightedOptionIndex++
        }
      
        optionElements[filteredOptions[highlightedOptionIndex].id]?.scrollIntoView({ block: "nearest" })
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
      
        if (isNullish(highlightedOptionIndex) || highlightedOptionIndex === 0) {
          highlightedOptionIndex = filteredOptions.length - 1
        } else {
          highlightedOptionIndex--
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
      highlightedOptionIndex = index
    } else if (event.type === "keypress" && event instanceof KeyboardEvent && event.key === "Enter") {
      selectOption(filteredOptions[index])
    } else if (event.type === "click") {
      selectOption(filteredOptions[index])
    }
  }
  
  $: filter, options, filterListener()
  const filterListener = () => {
    filteredOptions = options.filter((option) => {
      return option.keywords.toLowerCase().includes(filter.toLowerCase())
    })
    
    highlightedOptionIndex = 0
  }
  
</script>

<style>
  /* TODO Move this somewhere better */
  .highlighted {
    background-color: #ff3e0030;
    color: #ff3e00;
  }

  * {
    font-family: Roboto, sans-serif;
  }

  .surface {
    background-color: #212125;
  }

  .elevated {
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.3), 0px 8px 10px 1px rgba(0, 0, 0, 0.3), 0px 3px 14px 2px rgba(0, 0, 0, 0.3);
  }
</style>