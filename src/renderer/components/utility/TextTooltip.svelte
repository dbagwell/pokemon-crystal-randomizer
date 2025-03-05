<Stack
  alignment="start"
  direction="vertical"
  distribution="fill"
  minSpacing={10}
>
  {#each text.split("\n") as paragraph}
    <div use:textStyle={"content"}>
      {paragraph}
    </div>
  {/each}
</Stack>
  
<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { textStyle } from "@scripts/textStyle"
  
  type Props = {
    text: string
  }
  
  const {
    text,
  }: Props = $props()
</script>
    