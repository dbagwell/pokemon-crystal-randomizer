<Stack
  alignment="start"
  direction="vertical"
  distribution="fill"
>
  <label
    style:cursor="pointer"
    style:color={colors.text}
    style:font-size="16px"
    use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}
  >
    <input
      style:position="absolute"
      style:width="0"
      style:height="0"
      type="checkbox"
      bind:checked={viewModel.isOn}
    />
    <Stack
      alignment="center"
      direction="horizontal"
      distribution="start"
      minSpacing={10}
    >
      <div
        style:border="2px solid {viewModel.isOn ? colors.primaryButtonBackground : colors.inactiveTint}"
        style:border-radius="5px"
        style:cursor="pointer"
        style:width="20px"
        style:height="20px"
        style:font-size="15px"
        style:font-weight="900"
        style:color={viewModel.isOn ? colors.primaryButtonForeground : "transparent"}
        style:background-color={viewModel.isOn ? colors.primaryButtonBackground : "transparent"}
        class="material-icons"
      >
        checkmark
      </div>
      <div>
        {viewModel.name}
      </div>
    </Stack>
  </label>
  {#if "viewModels" in viewModel && viewModel.isOn}
    <div
      style:margin-left="9.5px"
      style:border-left="2px solid {colors.primaryButtonBackground}"
      style:border-radius="0 0 0 20px"
    >
      <Stack
        alignment="start"
        direction="vertical"
        distribution="start"
        minSpacing={15}
        padding={[10, 0, 0, 20]}
        wrap={true}
      >
        {#each viewModel.viewModels as subViewModel, index (subViewModel.id)}
          <SettingsInputView bind:viewModel={viewModel.viewModels[index]}/>
        {/each}
      </Stack>
    </div>
  {/if}
</Stack>

{#snippet descriptionTooltip()}
  <div>
    {viewModel.description}
  </div>
{/snippet}

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { ToggleViewModel } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    viewModel: ToggleViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
</script>