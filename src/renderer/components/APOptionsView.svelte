<Stack
  alignment="start"
  direction="vertical"
  distribution="start"
  minSpacing={20}
  padding={20}
  width="100%"
>
  <TextField
    title="Slot Name"
    type="text"
    bind:value={apOptions.slotName}
  />
  <TextField
    max={100}
    min={0}
    title="Progression Balancing"
    type="number"
    bind:value={apOptions.progressionBalancing}
  />
</Stack>

<script lang="ts">
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import type { APOptions } from "@shared/appData/apOptions"
  import { onMount } from "svelte"
  
  type Props = {
    initialAPOptions: APOptions | undefined
    inputAccessor: { getInput?: () => APOptions }
  }
  
  // TODO: Validate input
  
  const {
    initialAPOptions,
    inputAccessor,
  }: Props = $props()
  
  const defaultOptions: APOptions = {
    slotName: "Player{number}",
    progressionBalancing: 50,
  }
  
  // svelte-ignore state_referenced_locally
  const apOptions = $state(initialAPOptions ?? defaultOptions)
  
  onMount(() => {
    inputAccessor.getInput = () => {
      return apOptions
    }
  })
</script>