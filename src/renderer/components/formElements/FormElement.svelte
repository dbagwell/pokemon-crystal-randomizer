{#if config.type === "FormSection"}
  <FormSection config={config}/>
{:else if config.type === "ToggleInput"}
  <ToggleInput config={config}/>
{:else if config.type === "TextInput"}
  <TextInput config={config}/>
{:else if config.type === "IntegerInput"}
  <IntegerInput config={config}/>
{:else if config.type === "SelectorInput"}
  <SelectorInput config={config}/>
{/if}

<script lang="ts">
  import FormSection from "@components/formElements/FormSection.svelte"
  import IntegerInput from "@components/formElements/IntegerInput.svelte"
  import SelectorInput from "@components/formElements/SelectorInput.svelte"
  import TextInput from "@components/formElements/TextInput.svelte"
  import ToggleInput from "@components/formElements/ToggleInput.svelte"
  
  export let config: FormElementConfig
</script>