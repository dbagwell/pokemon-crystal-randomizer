import type { TrainerClass } from "@shared/types/gameData/trainerClass"
import type { TrainerClassId } from "@shared/types/gameDataIds/trainerClasses"

export const trainerClassesMap: IdMap<TrainerClassId, TrainerClass> = {
  LEADER: {
    id: "LEADER",
    name: "LEADER",
  },
  RIVAL: {
    id: "RIVAL",
    name: "RIVAL",
  },
  POKEMON_PROF: {
    id: "POKEMON_PROF",
    name: "POKÉMON PROF.",
  },
  ELITE_FOUR: {
    id: "ELITE_FOUR",
    name: "ELITE FOUR",
  },
  PKMN_TRAINER: {
    id: "PKMN_TRAINER",
    name: "PKMN TRAINER",
  },
  CHAMPION: {
    id: "CHAMPION",
    name: "CHAMPION",
  },
  SCIENTIST: {
    id: "SCIENTIST",
    name: "SCIENTIST",
  },
  YOUNGSTER: {
    id: "YOUNGSTER",
    name: "YOUNGSTER",
  },
  SCHOOLBOY: {
    id: "SCHOOLBOY",
    name: "SCHOOLBOY",
  },
  BIRD_KEEPER: {
    id: "BIRD_KEEPER",
    name: "BIRD KEEPER",
  },
  LASS: {
    id: "LASS",
    name: "LASS",
  },
  COOLTRAINER: {
    id: "COOLTRAINER",
    name: "COOLTRAINER",
  },
  BEAUTY: {
    id: "BEAUTY",
    name: "BEAUTY",
  },
  POKEMANIAC: {
    id: "POKEMANIAC",
    name: "POKÉMANIAC",
  },
  ROCKET: {
    id: "ROCKET",
    name: "ROCKET",
  },
  GENTLEMAN: {
    id: "GENTLEMAN",
    name: "GENTLEMAN",
  },
  SKIER: {
    id: "SKIER",
    name: "SKIER",
  },
  TEACHER: {
    id: "TEACHER",
    name: "TEACHER",
  },
  BUG_CATCHER: {
    id: "BUG_CATCHER",
    name: "BUG CATCHER",
  },
  FISHER: {
    id: "FISHER",
    name: "FISHER",
  },
  SWIMMERM: {
    id: "SWIMMERM",
    name: "SWIMMER♂",
  },
  SWIMMERF: {
    id: "SWIMMERF",
    name: "SWIMMER♀",
  },
  SAILOR: {
    id: "SAILOR",
    name: "SAILOR",
  },
  SUPER_NERD: {
    id: "SUPER_NERD",
    name: "SUPER NERD",
  },
  GUITARIST: {
    id: "GUITARIST",
    name: "GUITARIST",
  },
  HIKER: {
    id: "HIKER",
    name: "HIKER",
  },
  BIKER: {
    id: "BIKER",
    name: "BIKER",
  },
  BURGLAR: {
    id: "BURGLAR",
    name: "BURGLAR",
  },
  FIREBREATHER: {
    id: "FIREBREATHER",
    name: "FIREBREATHER",
  },
  JUGGLER: {
    id: "JUGGLER",
    name: "JUGGLER",
  },
  BLACKBELT: {
    id: "BLACKBELT",
    name: "BLACKBELT",
  },
  PSYCHIC: {
    id: "PSYCHIC",
    name: "PSYCHIC",
  },
  PICNICKER: {
    id: "PICNICKER",
    name: "PICNICKER",
  },
  CAMPER: {
    id: "CAMPER",
    name: "CAMPER",
  },
  SAGE: {
    id: "SAGE",
    name: "SAGE",
  },
  MEDIUM: {
    id: "MEDIUM",
    name: "MEDIUM",
  },
  BOARDER: {
    id: "BOARDER",
    name: "BOARDER",
  },
  POKEFAN: {
    id: "POKEFAN",
    name: "POKÉFAN",
  },
  KIMONO_GIRL: {
    id: "KIMONO_GIRL",
    name: "KIMONO GIRL",
  },
  TWINS: {
    id: "TWINS",
    name: "TWINS",
  },
  OFFICER: {
    id: "OFFICER",
    name: "OFFICER",
  },
  MYSTICALMAN: {
    id: "MYSTICALMAN",
    name: "MYSTICALMAN",
  },
} as const