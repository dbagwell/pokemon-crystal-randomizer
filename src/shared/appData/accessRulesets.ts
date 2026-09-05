import { classicEarlyFly } from "@shared/appData/accessRulesets/classicEarlyFly"
import { flashForDarkAreas } from "@shared/appData/accessRulesets/flashForDarkAreas"
import { flashForPokemon } from "@shared/appData/accessRulesets/flashForPokemon"
import { flyForPhoneCalls } from "@shared/appData/accessRulesets/flyForPhoneCalls"
import { flyForPokemon } from "@shared/appData/accessRulesets/flyForPokemon"
import { healingItemsForRed } from "@shared/appData/accessRulesets/healingItemsForRed"
import { newEarlyFly } from "@shared/appData/accessRulesets/newEarlyFly"
import { noVanillaBasement } from "@shared/appData/accessRulesets/noEarlyBasement"
import { noEarlySabrina } from "@shared/appData/accessRulesets/noEarlySabrina"
import { pokedexAndSweetScentForPokemon } from "@shared/appData/accessRulesets/pokedexAndSweetScentForPokemon"
import { xItemsForHardFights } from "@shared/appData/accessRulesets/xItemsForHardFights"
import type { AccessRequirement } from "@shared/types/gameData/warp"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { LogicalEventId } from "@shared/types/gameDataIds/logicalEvents"
import type { MartGroupId } from "@shared/types/gameDataIds/martGroups"
import type { SpecialShopId } from "@shared/types/gameDataIds/marts"
import type { WarpId } from "@shared/types/gameDataIds/warps"

export type AccessModifier = {
  LOCATIONS: (WarpId | ItemLocationId | MartGroupId | SpecialShopId | LogicalEventId)[]
  ADDED_REQUIREMENTS: AccessRequirement[]
}

export type AreaTransitionAccessModifier = {
  TO_AREA: LogicalAccessAreaId
  FROM_AREA: LogicalAccessAreaId
  IS_MUTUAL: boolean
  ADDED_REQUIREMENTS: AccessRequirement[]
}

export const accessRulesetIds = [
  "FLASH_FOR_DARK_AREAS",
  "CLASSIC_EARLY_FLY",
  "NEW_EARLY_FLY",
  "NO_VANILLA_BASEMENT",
  "NO_EARLY_SABRINA",
  "FLY_FOR_PHONE_CALLS",
  "FLY_FOR_POKEMON",
  "FLASH_FOR_POKEMON",
  "POKEDEX_AND_SWEET_SCENT_FOR_POKEMON",
  "X_ITEMS_FOR_HARD_FIGHTS",
  "HEALING_ITEMS_FOR_RED",
] as const

export type AccessRulesetId = typeof accessRulesetIds[number]
export type AccessRuleset = {
  id: AccessRulesetId
  name: string
  description?: string
  accessModifiers: (AccessModifier | AreaTransitionAccessModifier)[]
}

export const accessRulsetsMap: IdMap<AccessRulesetId, AccessRuleset> = {
  FLASH_FOR_DARK_AREAS: {
    id: "FLASH_FOR_DARK_AREAS",
    name: "Flash for Dark Areas",
    description: "Makes it so that both Zephyrbadge and HM05 (Flash) must be obtainable before having to enter any dark areas.",
    accessModifiers: flashForDarkAreas,
  },
  CLASSIC_EARLY_FLY: {
    id: "CLASSIC_EARLY_FLY",
    name: "Classic Early Fly",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before:\n"
      + "- going to Route 44 from Mahogany Town\n"
      + "- climbing the left waterfall in Tohjo Falls\n"
      + "- getting on the S.S. Aqua from either the Olivine or Vermilion Port\n"
      + "- entering the Power Plant\n"
      + "- waking the Snorlax in Vermilion City.",
    accessModifiers: classicEarlyFly,
  },
  NEW_EARLY_FLY: {
    id: "NEW_EARLY_FLY",
    name: "New Early Fly",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before:\n"
      + "- going to Route 44 from Mahogany Town\n"
      + "- climbing the left waterfall in Tohjo Falls\n"
      + "- entering the Power Plant\n"
      + "- waking the Snorlax in Vermilion City.",
    accessModifiers: newEarlyFly,
  },
  NO_VANILLA_BASEMENT: {
    id: "NO_VANILLA_BASEMENT",
    name: "No Vanilla Basement",
    description: "Makes it so that if the Card Key is shuffled it must be obtainable before having to use the Basement Key.",
    accessModifiers: noVanillaBasement,
  },
  NO_EARLY_SABRINA: {
    id: "NO_EARLY_SABRINA",
    name: "7 Badges for Sabrina",
    description: "Makes it so that at least 7 badges must be obtainable before having to fight Sabrina.",
    accessModifiers: noEarlySabrina,
  },
  FLY_FOR_PHONE_CALLS: {
    id: "FLY_FOR_PHONE_CALLS",
    name: "Fly for Phone Calls",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before having get items from phone call trainers.",
    accessModifiers: flyForPhoneCalls,
  },
  FLY_FOR_POKEMON: {
    id: "FLY_FOR_POKEMON",
    name: "Fly for Pokémon Checks",
    description: "Makes it so that both Stormbadge and HM02 (Fly) must be obtainable before having get items that require obtaining specific species of Pokémon.",
    accessModifiers: flyForPokemon,
  },
  FLASH_FOR_POKEMON: {
    id: "FLASH_FOR_POKEMON",
    name: "Flash for Pokémon Checks",
    description: "Makes it so that both Zephyrbadge and HM05 (Flash) must be obtainable before having get items that require obtaining specific species of Pokémon.",
    accessModifiers: flashForPokemon,
  },
  POKEDEX_AND_SWEET_SCENT_FOR_POKEMON: {
    id: "POKEDEX_AND_SWEET_SCENT_FOR_POKEMON",
    name: "Pokédex and Sweet Scent for Pokémon Checks",
    description: "Makes it so that both the Pokédex and TM12 (Sweet Scent) must be obtainable before having get items that require obtaining specific species of Pokémon.",
    accessModifiers: pokedexAndSweetScentForPokemon,
  },
  X_ITEMS_FOR_HARD_FIGHTS: {
    id: "X_ITEMS_FOR_HARD_FIGHTS",
    name: "X Items for Hard Fights",
    description: "Makes it so that X Attack, X Special, X Defend, X Speed, X Accuracy, Guard Spec., and Dire Hit must be obtainable before having to battle the following trainers:\n"
      + "- Sages in the Tin Tower Gate\n"
      + "- Rocket Executives in Radio Tower\n"
      + "- Trainers on Route 25\n"
      + "- Rival in the Goldenrod Underground Switch Room\n"
      + "- Rival in Victory Road\n"
      + "- Rival in Mount Moon\n"
      + "- Leader Brock\n"
      + "- Leader Misty\n"
      + "- Leader Lt. Surge\n"
      + "- Leader Erika\n"
      + "- Leader Janine\n"
      + "- Leader Sabrina\n"
      + "- Leader Blaine\n"
      + "- Leader Blue\n"
      + "- Elite 4 Will\n"
      + "- Elite 4 Koga\n"
      + "- Elite 4 Bruno\n"
      + "- Elite 4 Karen\n"
      + "- Champion Lance\n"
      + "- Pokémon Trainer Red",
    accessModifiers: xItemsForHardFights,
  },
  HEALING_ITEMS_FOR_RED: {
    id: "HEALING_ITEMS_FOR_RED",
    name: "Healing Items for Red",
    description: "Makes it so the following items must be obtainable before having to fight Red:\n"
      + "- Potion\n"
      + "- Super Potion\n"
      + "- Hyper Potion\n"
      + "- Max Potion\n"
      + "- Full Restore\n"
      + "- Revive\n"
      + "- Full Heal",
    accessModifiers: healingItemsForRed,
  },
} as const