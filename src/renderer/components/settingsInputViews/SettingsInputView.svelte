{#if viewModel.type === "INTEGER_INPUT"}
  <IntegerInputView viewModel={viewModel}/>
{:else if viewModel.type === "INTEGER_INPUT_GROUP"}
  <IntegerInputGroupView viewModel={viewModel}/>
{:else if viewModel.type === "TEXT_INPUT"}
  <TextInputView viewModel={viewModel}/>
{:else if viewModel.type === "SINGLE_SELECTOR"}
  <SingleSelectorView viewModel={viewModel}/>
{:else if viewModel.type === "SIMPLE_MULTI_SELECTOR"}
  <SimpleMultiSelectorView viewModel={viewModel}/>
{:else if viewModel.type === "CONFIGURABLE_MULTI_SELECTOR"}
  <ConfigurableMultiSelectorView viewModel={viewModel}/>
{:else if viewModel.type === "TOGGLE"}
  <ToggleView viewModel={viewModel}/>
{:else}
  <Never neverValue={viewModel}/>
{/if}
<div>
</div>

<script lang="ts">
  import ConfigurableMultiSelectorView from "@components/settingsInputViews/ConfigurableMultiSelectorView.svelte"
  import IntegerInputGroupView from "@components/settingsInputViews/IntegerInputGroupView.svelte"
  import IntegerInputView from "@components/settingsInputViews/IntegerInputView.svelte"
  import SimpleMultiSelectorView from "@components/settingsInputViews/SimpleMultiSelectorView.svelte"
  import SingleSelectorView from "@components/settingsInputViews/SingleSelectorView.svelte"
  import TextInputView from "@components/settingsInputViews/TextInputView.svelte"
  import ToggleView from "@components/settingsInputViews/ToggleView.svelte"
  import Never from "@components/utility/Never.svelte"
  import type { InputViewModel } from "@shared/types/viewModels"

  export let viewModel: InputViewModel
</script>