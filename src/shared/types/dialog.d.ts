type DialogInputInfo = {
  title?: string,
  type?: "file",
  fileExtension?: string,
}

type ShowDialogParams = {
  title?: string,
  message?: string,
  inputInfo?: DialogInputInfo,
  submitButtonLabel?: string,
  hasCancelButton?: boolean,
  onCancel?: () => void,
  onSubmit?: (inputValue: any) => void,
}