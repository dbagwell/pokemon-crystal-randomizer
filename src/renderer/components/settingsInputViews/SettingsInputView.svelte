{#if viewModel.type === "INTEGER_INPUT"}
  <IntegerInputView bind:viewModel={viewModel}/>
{:else if viewModel.type === "INTEGER_INPUT_GROUP"}
  <IntegerInputGroupView bind:viewModel={viewModel}/>
{:else if viewModel.type === "TEXT_INPUT"}
  <TextInputView bind:viewModel={viewModel}/>
{:else if viewModel.type === "SINGLE_SELECTOR"}
  <SingleSelectorView bind:viewModel={viewModel}/>
{:else if viewModel.type === "SIMPLE_MULTI_SELECTOR"}
  <SimpleMultiSelectorView bind:viewModel={viewModel}/>
{:else if viewModel.type === "CONFIGURABLE_MULTI_SELECTOR"}
  <ConfigurableMultiSelectorView bind:viewModel={viewModel}/>
{:else if viewModel.type === "GROUP_MULTI_SELECTOR"}
  <GroupMultiSelectorView bind:viewModel={viewModel}/>
{:else if viewModel.type === "TOGGLE"}
  <ToggleView bind:viewModel={viewModel}/>
{:else}
  <Never neverValue={viewModel}/>
{/if}

<script lang="ts">
  import ConfigurableMultiSelectorView from "@components/settingsInputViews/ConfigurableMultiSelectorView.svelte"
  import GroupMultiSelectorView from "@components/settingsInputViews/GroupMultiSelectorView.svelte"
  import IntegerInputGroupView from "@components/settingsInputViews/IntegerInputGroupView.svelte"
  import IntegerInputView from "@components/settingsInputViews/IntegerInputView.svelte"
  import SimpleMultiSelectorView from "@components/settingsInputViews/SimpleMultiSelectorView.svelte"
  import SingleSelectorView from "@components/settingsInputViews/SingleSelectorView.svelte"
  import TextInputView from "@components/settingsInputViews/TextInputView.svelte"
  import ToggleView from "@components/settingsInputViews/ToggleView.svelte"
  import Never from "@components/utility/Never.svelte"
  import type { InputViewModel } from "@shared/types/viewModels"
  
  type Props = {
    viewModel: InputViewModel
  }
  
  let {
    viewModel = $bindable(),
  }: Props = $props()
</script>