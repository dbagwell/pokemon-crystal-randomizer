<Stack
  alignment="start"
  direction="vertical"
  distribution="fill"
>
  {#if config.hasToggle === true}
    <!-- TODO: Make this checkbox a component and style it up -->
    <label style:cursor="pointer">
      <input
        style:cursor="pointer"
        type="checkbox"
        bind:checked={config.toggleValue}
      />
      {config.label}
    </label>
  {:else if isNotNullish(config.label)}
    {config.label} <!-- TODO: Styling -->
  {/if}
  <!-- TODO: Description -->
  {#if !config.hasToggle || config.toggleValue}
    <Stack
      alignment="start"
      direction={config.layout}
      distribution="start"
      minSpacing={10}
      padding={[10, 0, 0, 20]}
      wrap={true}
    >
      {#each Object.entries(config.subElementConfigs) as [id, subConfig] (id)}
        <FormElement config={subConfig}/>
      {/each}
    </Stack>
  {/if}
</Stack>

<script lang="ts">
  import FormElement from "@components/formElements/FormElement.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { isNotNullish } from "@shared/utils"
  
  export let config: FormSectionConfig
</script>