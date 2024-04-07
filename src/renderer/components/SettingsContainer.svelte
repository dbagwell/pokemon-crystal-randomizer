<Paper>
  <Content>
    <Subtitle>{category.title}</Subtitle>
    <div
      style:display="flex"
      style:flex-wrap="wrap"
      style:flex-direction={category.layout ?? "column"}
      style:gap="10px"
    >
      {#each category.settings ?? [] as setting}
        <GeneratorSettingInput
          bind:this={inputs[setting.id]}
          setting={setting}
        />
      {/each}
    </div>
    {#each category.subcategories ?? [] as subcategory}
      <svelte:self
        bind:this={subcategoryContainers[subcategory.id]}
        category={subcategory}
      />
    {/each}
    <br>
  </Content>
</Paper>

<script lang="ts">
  import GeneratorSettingInput from "@components/GeneratorSettingInput.svelte"
  import { reduceDictionaryInto } from "@shared/utils"
  import Paper, { Content, Subtitle } from "@smui/paper"
  
  export let category: Category
  const inputs: Dictionary<GeneratorSettingInput> = {}
  const subcategoryContainers: Dictionary<any> = {}
  
  export const getValues = () => {
    const settings = reduceDictionaryInto(inputs, {}, (object, key, value) => {
      object[key] = value.getValue()
    })
    
    const subcategories = reduceDictionaryInto(subcategoryContainers, {}, (object, key, value) => {
      object[key] = value.getValues()
    })
    
    return {
      ...settings,
      ...subcategories,
    }
  }
</script>