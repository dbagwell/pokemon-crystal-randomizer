<div
  style:display={display}
  style:position="absolute"
  style:inset="0"
  style:width="100%"
  style:height="100%"
  style:background-color="#00000055"
  style:backdrop-filter="blur(10px)"
>
  <div
    style:display="flex"
    style:align-items="center"
    style:justify-content="center"
    style:height="100%"
  >
    <CircularProgress
      style="width: 100px; height: 100px;"
      indeterminate={true}
    />
  </div>
</div>

<script lang="ts">
  import CircularProgress from "@smui/circular-progress"
  
  let display = "none"
  
  showProgressIndicator = () => {
    display = "block"
  }
  
  hideProgressIndicator = () => {
    display = "none"
  }
  
</script>

<script
  context="module"
  lang="ts"
>
  
  export let showProgressIndicator: () => void
  export let hideProgressIndicator: () => void

</script>