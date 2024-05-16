export const fishingGroupIds = [
  "SHORE",
  "OCEAN",
  "LAKE",
  "POND",
  "WHIRL_ISLANDS",
  "REMORAID",
  "QWILFISH",
  "GYARADOS",
  "DRATINI",
  "DRATINI_2",
] as const

export type FishingGroupId = typeof fishingGroupIds[number]