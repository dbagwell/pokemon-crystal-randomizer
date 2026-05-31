export const buttonIds = [
  "IMPORT_CUSTOM_NAMES",
  "EXPORT_CUSTOM_NAMES",
] as const

export type ButtonId = typeof buttonIds[number]