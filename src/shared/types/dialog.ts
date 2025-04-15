export type DialogInputInfo = {
  title?: string
} & ({
  type: "file"
  fileExtension?: string
} | {
  type: "text"
  validator?: (text: string) => string | undefined
})