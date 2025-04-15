<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <Stack
    alignment="center"
    direction="horizontal"
    distribution="start"
    minSpacing={10}
  >
    <div
      style:background-color={viewModel.selectedOptionIds.length > 0 ? colors.primaryTint : colors.inactiveTint}
      style:border-radius="5px"
      style:width="20px"
      style:height="20px"
    >
    </div>
    <div
      style:color={colors.text}
      use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}
    >
      {viewModel.name}
    </div>
  </Stack>
  <div
    style:border-left="2px solid {viewModel.selectedOptionIds.length > 0 ? colors.primaryTint : colors.inactiveTint}"
    style:border-radius="0 0 0 20px"
    style:margin-left="9px"
  >
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="start"
      minSpacing={10}
      padding={[5, 0, 10, 20]}
    >
      {#each viewModel.selectedOptionIds as groupIds, groupIndex (groupIndex)}
        <Stack
          alignment="fill"
          direction="vertical"
          distribution="start"
        >
          {#if groupIds.length > 0 || availableOptions.length > 0}
            {#if viewModel.selectedOptionIds.length > 0 || availableOptions.length > 0}
              <Stack
                alignment="center"
                direction="horizontal"
                distribution="start"
                minSpacing={10}
              >
                <button
                  style:border="2px solid {removeGroupButtonHoveredIndex === groupIndex ? colors.destructiveTint : colors.primaryTint}"
                  style:border-radius="5px"
                  style:cursor="pointer"
                  style:width="20px"
                  style:height="20px"
                  style:font-size="15px"
                  style:font-weight="900"
                  style:color={colors.primarySurface}
                  style:background-color={removeGroupButtonHoveredIndex === groupIndex ? colors.destructiveTint : colors.primaryTint}
                  style:text-align="center"
                  style:padding="0"
                  class="material-icons"
                  onclick={() => { removeGroup(groupIndex) }}
                  onmouseenter={() => { handleMouseEnterRemoveGroupButtonEvent(groupIndex) }}
                  onmouseleave={handleMouseLeaveRemoveGroupButtonEvent}
                >
                  cancel
                </button>
                <div style:color={colors.text}>
                  Group {groupIndex + 1}
                </div>
              </Stack>
            {/if}
            <div
              style:border-left="2px solid {viewModel.selectedOptionIds.length > 0 ? colors.primaryTint : colors.inactiveTint}"
              style:border-radius="0 0 0 20px"
              style:margin-left="9px"
            >
              <Stack
                alignment="fill"
                direction="vertical"
                distribution="start"
                minSpacing={5}
                padding={[5, 0, 10, 20]}
              >
                {#if viewModel.selectedOptionIds.length > 0}
                  {#each selectedOptions[groupIndex] as selectedOption, idIndex (selectedOption.id)}
                    {#snippet optionDescriptionTooltip()}
                      <TextTooltip text={selectedOption.description!}/>
                    {/snippet}
              
                    <Stack
                      alignment="center"
                      direction="horizontal"
                      distribution="fill"
                      minSpacing={5}
                    >
                      <Button
                        style="deemphasized-text"
                        icon="cancel"
                        isDestructive={true}
                        onClick={() => { removeSelectedValue(groupIndex, idIndex) }}
                      />
                      <div
                        style:text-wrap="nowrap"
                        style:flex-grow="1"
                        style:color={colors.text}
                        style:font-size="16px"
                        use:tooltip={isNotNullish(selectedOption.description) ? optionDescriptionTooltip : undefined}
                      >
                        {selectedOption.name}
                      </div>
                    </Stack>
                  {/each}
                {/if}
                {#if availableOptions.length > 0}
                  <AutocompleteTextField
                    clearOnFocus={true}
                    clearOnSelect={true}
                    onSelect={(optionId) => { handleAutocompleteSelection(groupIndex, optionId) }}
                    options={availableOptions.map((option) => {
                      return {
                        id: option.id,
                        name: option.name,
                        description: option.description,
                        keywords: option.name,
                        value: option.id,
                      }
                    })}
                    restoreOnBlur={false}
                    title="Choose"
                  />
                {/if}
              </Stack>
            </div>
          {/if}
        </Stack>
      {/each}
      {#if availableOptions.length > 0 && (viewModel.selectedOptionIds.length === 0 || viewModel.selectedOptionIds[viewModel.selectedOptionIds.length - 1].length > 0)}
        <Stack
          alignment="fill"
          direction="horizontal"
          distribution="start"
        >
          <Button
            style="text"
            icon="add"
            onClick={addGroup}
            title="Add Group"
          />
        </Stack>
      {/if}
    </Stack>
  </div>
</Stack>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { GroupMultiSelectorViewModel, SelectorOption } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    viewModel: GroupMultiSelectorViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  const availableOptions: SelectorOption[] = $derived.by(() => {
    return viewModel.options.filter((option) => {
      return !viewModel.selectedOptionIds.flat().includes(option.id)
    })
  })
  
  const selectedOptions: SelectorOption[][] = $derived.by(() => {
    return viewModel.selectedOptionIds.map((ids) => {
      return ids.map((id) => {
        return viewModel.options.find((option) => {
          return option.id === id
        })!
      })
    })
  })
  
  const addGroup = () => {
    viewModel.selectedOptionIds.push([])
  }
  
  const removeGroup = (groupIndex: number) => {
    viewModel.selectedOptionIds.splice(groupIndex, 1)
    viewModel.selectedOptionIds = viewModel.selectedOptionIds
  }
  
  const handleAutocompleteSelection = (groupIndex: number, optionId: string | undefined) => {
    const option = viewModel.options.find((option) => {
      return option.id === optionId
    })
    
    if (isNotNullish(option)) {
      viewModel.selectedOptionIds[groupIndex].push(option.id)
      viewModel.selectedOptionIds = viewModel.selectedOptionIds
    }
  }
  
  const removeSelectedValue = (groupIndex: number, idIndex: number) => {
    viewModel.selectedOptionIds[groupIndex].splice(idIndex, 1)
    
    viewModel.selectedOptionIds.forEach((group, index) => {
      if (index < viewModel.selectedOptionIds.length && group.length === 0) {
        viewModel.selectedOptionIds.splice(index, 1)
      }
    })
    
    viewModel.selectedOptionIds = viewModel.selectedOptionIds
  }
  
  let removeGroupButtonHoveredIndex: number | undefined = $state(undefined)
  
  const handleMouseEnterRemoveGroupButtonEvent = (index:number) => {
    removeGroupButtonHoveredIndex = index
  }
  
  const handleMouseLeaveRemoveGroupButtonEvent = () => {
    removeGroupButtonHoveredIndex = undefined
  }
</script>