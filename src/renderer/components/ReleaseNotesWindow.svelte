<div
  style:position="absolute"
  style:background-color={colors.tertiarySurface}
  style:padding="10px"
  style:width="100%"
  style:height="100%"
>
  <div
    style:background-color={colors.primarySurface}
    style:border-radius="20px"
    style:width="100%"
    style:height="100%"
    style:overflow="hidden"
  >
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="fill"
      height="100%"
      minSpacing={20}
      padding={10}
      width="100%"
    >
      <div use:textStyle={"title"}>
        New Version Available
      </div>
      <div use:textStyle={"content"}>
        Version {newVersionNumber} of Pokémon Crystal Randomizer is now available.<br>
        You are currently using version {currentVersionNumber}.<br>
        The new version includes the following changes:
      </div>
      <div
        bind:this={container}
        style:background-color={colors.secondarySurface}
        style:border-radius="20px"
        style:padding="1px 20px 10px 20px"
        style:min-height="100px"
        style:overflow="auto"
        style:flex-grow="1"
        style:flex-shrink="1"
      >
        <Stack
          alignment="fill"
          direction="vertical"
          distribution="fill"
          height="100%"
          minSpacing={5}
          width="100%"
        >
          {#each releaseNotes as releaseNote, index (releaseNote.version)}
            {#if index !== 0}
              <hr style:width="100%">
            {/if}
            <div>
              <h1>Version {releaseNote.version}</h1>
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html DOMPurify.sanitize(releaseNote.note ?? "")}
            </div>
          {/each}
        </Stack>
      </div>
      <div use:textStyle={"content"}>
        Would you like to update?
      </div>
      <Stack
        alignment="center"
        direction="vertical"
        distribution="fill"
        minSpacing={20}
      >
        <Button
          style="fill"
          onClick={updateAndRestart}
          title="Update and Restart"
        />
        <Button
          style="text"
          onClick={askAgainLager}
          title="Ask Again Later"
        />
        <Button
          style="text"
          isDestructive={true}
          onClick={skipUpdate}
          title="Skip Update"
        />
      </Stack>
    </Stack>
  </div>
</div>

<ProgressIndicator/>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { textStyle } from "@scripts/textStyle"
  import DOMPurify from "dompurify"
  import ProgressIndicator, { showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  
  let container: HTMLElement
  let currentVersionNumber = ""
  let newVersionNumber = ""
  let releaseNotes: { version: string, note: string | null }[] = []
  
  const updateAndRestart = () => {
    performAction?.("UPDATE")
  }
  
  const askAgainLager = () => {
    performAction?.("IGNORE")
  }
  
  const skipUpdate = () => {
    performAction?.("SKIP")
  }
  
  let performAction: ((response: "UPDATE" | "IGNORE" | "SKIP") => void) | undefined
  
  setReleaseNotes = (
    releaseNotesArray: { version: string, note: string | null }[],
    currentVersionNumberValue: string,
    newVersionNumberValue: string,
    performSelectedAction: (response: "UPDATE" | "IGNORE" | "SKIP") => void,
  ) => {
    releaseNotes = releaseNotesArray
    currentVersionNumber = currentVersionNumberValue
    newVersionNumber = newVersionNumberValue
    performAction = (response: "UPDATE" | "IGNORE" | "SKIP") => {
      showProgressIndicator()
      performSelectedAction(response)
    }
  }
</script>

<script
  lang="ts"
  module
>
  export let setReleaseNotes: (
    releaseNotes: { version: string, note: string | null }[],
    currentVersionNumber: string,
    newVersionNumber: string,
    performSelectedAction: (selectedAction: "UPDATE" | "IGNORE" | "SKIP") => void,
  ) => void
</script>