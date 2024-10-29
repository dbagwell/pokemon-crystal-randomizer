<Stack
  alignment="start"
  direction="vertical"
  distribution="fill"
>
  <!-- TODO: style it up -->
  <label
    style:cursor="pointer"
    style:color={colors.text}
    style:font-size="16px"
  >
    <input
      style:cursor="pointer"
      type="checkbox"
      bind:checked={viewModel.isOn}
    />
    {viewModel.name}
  </label>
  <!-- TODO: Description -->
  {#if "viewModels" in viewModel && viewModel.isOn}
    <div
      style:border-left="1px solid {colors.separator}"
      style:border-radius="0 0 0 20px"
    >
      <Stack
        alignment="start"
        direction="vertical"
        distribution="start"
        minSpacing={10}
        padding={[10, 0, 0, 20]}
        wrap={true}
      >
        {#each viewModel.viewModels as subViewModel (subViewModel.id)}
          <SettingsInputView viewModel={subViewModel}/>
        {/each}
      </Stack>
    </div>
  {/if}
</Stack>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import { colors } from "@scripts/colors"
  import type { ToggleViewModel } from "@shared/types/viewModels"
  
  export let viewModel: ToggleViewModel
</script>