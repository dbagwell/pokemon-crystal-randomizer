export const accessRulesetIds = [
  "CLASSIC_EARLY_FLY",
  "NO_VANILLA_BASEMENT",
  "NO_EARLY_SABRINA",
  "FLY_FOR_PHONE_CALLS",
  "FLY_FOR_POKEMON",
  "X_ITEMS_FOR_HARD_FIGHTS",
  "HEALING_ITEMS_FOR_RED",
] as const

export type AccessRulesetId = typeof accessRulesetIds[number]
export type AccessRuleset = {
  id: AccessRulesetId
  name: string
  description?: string
}

export const accessRulsetsMap: IdMap<AccessRulesetId, AccessRuleset> = {
  CLASSIC_EARLY_FLY: {
    id: "CLASSIC_EARLY_FLY",
    name: "Classic Early Fly",
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
    name: "7 Badges for Sabrina",
    description: "Makes it so that at least 7 badges must be obtainable before having to fight Sabrina.",
  },
  FLY_FOR_PHONE_CALLS: {
    id: "FLY_FOR_PHONE_CALLS",
    name: "Fly for Phone Calls",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before having get items from phone call trainers.",
  },
  FLY_FOR_POKEMON: {
    id: "FLY_FOR_POKEMON",
    name: "Fly for Pokémon Checks",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before having get items that require obtaining specific species of Pokémon.",
  },
  X_ITEMS_FOR_HARD_FIGHTS: {
    id: "X_ITEMS_FOR_HARD_FIGHTS",
    name: "X Items for Hard Fights",
    description: "Makes it so that X Attack, X Special, X Defend, X Speed, X Accuracy, Guard Spec., and Dire Hit must be obtainable before having to battle the following trainers:\n"
      + "- Sages in the Tin Tower Gate"
      + "- Rocket Executives in Radio Tower"
      + "- Trainers on Route 25"
      + "- Rival in the Goldenrod Underground Switch Room"
      + "- Rival in Victory Road"
      + "- Rival in Mount Moon"
      + "- Leader Brock"
      + "- Leader Misty"
      + "- Leader Lt. Surge"
      + "- Leader Erika"
      + "- Leader Janine"
      + "- Leader Sabrina"
      + "- Leader Blaine"
      + "- Leader Blue"
      + "- Elite 4 Will"
      + "- Elite 4 Koga"
      + "- Elite 4 Bruno"
      + "- Elite 4 Karen"
      + "- Champion Lance"
      + "- Pokémon Trainer Red",
  },
  HEALING_ITEMS_FOR_RED: {
    id: "HEALING_ITEMS_FOR_RED",
    name: "Healing Items for Red",
    description: "Makes it so the following items must be obtainable before having to fight Red:\n"
      + "- POTION"
      + "- SUPER_POTION"
      + "- HYPER_POTION"
      + "- MAX_POTION"
      + "- FULL_RESTORE"
      + "- REVIVE"
      + "- FULL_HEAL",
  },
} as const