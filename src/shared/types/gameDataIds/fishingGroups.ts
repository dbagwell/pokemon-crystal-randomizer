export const fishingGroupIds = [
  "SHORE",
  "OCEAN",
  "LAKE",
  "POND",
  "DRATINI",
  "QWILFISH_SWARM",
  "REMORAID_SWARM",
  "GYARADOS",
  "DRATINI_2",
  "WHIRL_ISLANDS",
  "QWILFISH",
  "REMORAID",
] as const

export type FishingGroupId = typeof fishingGroupIds[number]