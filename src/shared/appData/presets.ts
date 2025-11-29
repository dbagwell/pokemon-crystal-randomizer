export const presetIds = [
  "VANILLA",
  "CLASSIC_BINGO",
  "BINGO_PLUS",
  "CLASSIC_MAX",
  "MAXIMUM_PLUS",
  "CUSTOM",
] as const

export type PresetId = typeof presetIds[number]
export type Preset = {
  id: PresetId
  name: string
  description?: string
}

export const presetsMap: IdMap<PresetId, Preset> = {
  VANILLA: {
    id: "VANILLA",
    name: "Vanilla",
    description: "All settings are disabled or set to their vanilla behaviour. Games generated with these settings are unchaged from vanilla except for the title screen.",
  },
  CLASSIC_BINGO: {
    id: "CLASSIC_BINGO",
    name: "Classic Bingo",
    description: "Mimics the settings that have been classically used by the 'Cinco Bingo' community for tournaments and weekly races.\n"
      + "Adds some basic QoL changes, randomizes Pokémon, Moves, and 'Non-Key' items, and skips some longer portions of the plot.",
  },
  BINGO_PLUS: {
    id: "BINGO_PLUS",
    name: "Bingo+",
    description: "Same as 'Classic Bingo' but adds some more Quality of Life changes.",
  },
  CLASSIC_MAX: {
    id: "CLASSIC_MAX",
    name: "Classic Max",
    description: "Mimics the settings that have been classically used by the Crystal Item Rando Community for co-op races.\n"
      + "Adds lots of QoL changes, randomizes Pokémon and moves, shuffles most items, including key items and shops, together in one big pool.",
  },
  MAXIMUM_PLUS: {
    id: "MAXIMUM_PLUS",
    name: "Maximum+",
    description: "Same as 'Classic Max' but adds some more Quality of Life changes, includes some additional items in the pool of shuffled items, and replaces some less useful items with some more useful ones.",
  },
  CUSTOM: {
    id: "CUSTOM",
    name: "Custom",
  },
} as const