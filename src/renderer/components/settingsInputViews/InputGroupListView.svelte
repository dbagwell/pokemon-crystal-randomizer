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
      style:background-color={viewModel.groups.length > 0 ? colors.primaryTint : colors.inactiveTint}
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
    style:border-left="2px solid {viewModel.groups.length > 0 ? colors.primaryTint : colors.inactiveTint}"
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
      {#each viewModel.groups as viewModels, groupIndex (groupIndex)}
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
              {viewModel.itemName} {groupIndex + 1}
            </div>
          </Stack>
          <div
            style:border-left="2px solid {colors.primaryTint}"
            style:border-radius="0 0 0 20px"
            style:margin-left="9px"
          >
            <Stack
              alignment="start"
              direction="vertical"
              distribution="start"
              minSpacing={15}
              padding={[10, 0, 10, 20]}
              wrap={true}
            >
              {#each viewModels as subViewModel, index (subViewModel.id)}
                <SettingsInputView bind:viewModel={viewModel.groups[groupIndex][index]}/>
              {/each}
            </Stack>
          </div>
        </Stack>
      {/each}
      <Stack
        alignment="fill"
        direction="horizontal"
        distribution="start"
      >
        <Button
          style="text"
          icon="add"
          onClick={addGroup}
          title="Add {viewModel.itemName}"
        />
      </Stack>
    </Stack>
  </div>
</Stack>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { InputGroupListViewModel } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    viewModel: InputGroupListViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  const addGroup = () => {
    viewModel.groups.push(viewModel.createGroupFunction())
  }
  
  const removeGroup = (groupIndex: number) => {
    viewModel.groups.splice(groupIndex, 1)
    viewModel.groups = viewModel.groups
  }
  
  let removeGroupButtonHoveredIndex: number | undefined = $state(undefined)
  
  const handleMouseEnterRemoveGroupButtonEvent = (index:number) => {
    removeGroupButtonHoveredIndex = index
  }
  
  const handleMouseLeaveRemoveGroupButtonEvent = () => {
    removeGroupButtonHoveredIndex = undefined
  }
</script>