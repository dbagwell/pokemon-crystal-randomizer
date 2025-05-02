export const debounce = (action: () => void, millisecondsToWait: number) => {
  let timeoutId: NodeJS.Timeout | undefined
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      action()
    }, millisecondsToWait)
  }
}