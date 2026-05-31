<Button
  style="text"
  onClick={onClick}
  title={viewModel.name}
/>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import { handleButton } from "@components/PlayerOptionsView.svelte"
  import type { ButtonViewModel } from "@shared/types/viewModels"
  
  type Props = {
    viewModel: ButtonViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  const onClick = () => {
    handleButton(viewModel.id)
  }
</script>