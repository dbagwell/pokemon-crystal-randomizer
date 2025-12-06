export const presetIds = [
  "VANILLA",
  "CLASSIC_BINGO",
  "BINGO_PLUS",
  "CLASSIC_KIR",
  "CLASSIC_EXTREME_KIR",
  "CLASSIC_FIR",
  "CLASSIC_EXTREME_FIR",
  "CLASSIC_CRAZY_FIR",
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
      + "Adds some basic QoL changes. Randomizes Pokémon, moves, item balls, and hidden items, and skips some longer portions of the plot.",
  },
  BINGO_PLUS: {
    id: "BINGO_PLUS",
    name: "Bingo+",
    description: "Same as 'Classic Bingo' but adds some more Quality of Life changes.",
  },
  CLASSIC_KIR: {
    id: "CLASSIC_KIR",
    name: "Classic KIR",
    description: "Adds lots of QoL changes. Randomized Pokémon, moves, item balls, and hidden items. Shuffles all key items together (including HM's and menu items) and shuffles badges separately.",
  },
  CLASSIC_EXTREME_KIR: {
    id: "CLASSIC_EXTREME_KIR",
    name: "Classic Extreme KIR",
    description: "Same as 'Classic KIR' but badges are shuffled together with the other key items.",
  },
  CLASSIC_FIR: {
    id: "CLASSIC_FIR",
    name: "Classic FIR",
    description: "Same as 'Classic KIR' but item balls are not randomized. Also, item balls, and most simple gift items (doesn't include ones with time/happiness/phone call/Pokémon requirements) are shuffled with the key items.",
  },
  CLASSIC_EXTREME_FIR: {
    id: "CLASSIC_EXTREME_FIR",
    name: "Classic Extreme FIR",
    description: "Same as 'Classic FIR' but badges are shuffled together with the other key items.",
  },
  CLASSIC_CRAZY_FIR: {
    id: "CLASSIC_CRAZY_FIR",
    name: "Classic Crazy Chaos FIR",
    description: "Same as 'Classic Extreme FIR' hidden items are not randomized. Also, hidden items, fruit trees, and gift items with time and hapiness requirements are shuffled with all the other shuffled items.",
  },
  CLASSIC_MAX: {
    id: "CLASSIC_MAX",
    name: "Classic Max",
    description: "Mimics the settings that have been classically used by the Crystal Item Rando Community for co-op races.\n"
      + "Adds lots of QoL changes, randomizes Pokémon and moves, shuffles most items, including key items and shops, together in one big pool. Makes Mt. Silver accessible before having 16 badges.",
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