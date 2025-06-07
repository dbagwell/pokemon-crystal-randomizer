export const accessRulesetIds = [
  "EARLY_FLY",
  "NO_VANILLA_BASEMENT",
  "NO_EARLY_SABRINA",
] as const

export type AccessRulesetId = typeof accessRulesetIds[number]
export type AccessRuleset = {
  id: AccessRulesetId
  name: string
  description?: string
}

export const accessRulsetsMap: IdMap<AccessRulesetId, AccessRuleset> = {
  EARLY_FLY: {
    id: "EARLY_FLY",
    name: "Early Fly",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before:\n"
      + "- going to Route 44 from Mahogany Town\n"
      + "- climbing the left waterfall in Tohjo Falls\n"
      + "- getting on the S.S. Aqua from either the Olivine or Vermilion Port\n"
      + "- entering the Power Plant\n"
      + "- entering the Vermilion entrance of Diglett's Cave.",
  },
  NO_VANILLA_BASEMENT: {
    id: "NO_VANILLA_BASEMENT",
    name: "No Vanilla Basement",
    description: "Makes it so that if the Card Key is shuffled it must be obtainable before having to use the Basement Key.",
  },
  NO_EARLY_SABRINA: {
    id: "NO_EARLY_SABRINA",
    name: "No Early Sabrina",
    description: "Makes it so that at least 7 badges must be obtainable before having to fight Sabrina.",
  },
} as const