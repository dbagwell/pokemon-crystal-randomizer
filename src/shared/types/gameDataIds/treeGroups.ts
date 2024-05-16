export const treeGroupIds = [
  "CANYON",
  "TOWN",
  "ROUTE",
  "KANTO",
  "LAKE",
  "FOREST",
] as const

export type TreeGroupId = typeof treeGroupIds[number]