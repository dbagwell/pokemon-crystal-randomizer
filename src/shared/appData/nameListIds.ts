  
export const nameListIds = [
  "CLASS_NAMES",
  "TWINS_CLASS_NAMES",
  "TRAINER_NAMES",
  "TWINS_TRAINER_NAMES",
  "POKEMON_NICKNAMES",
] as const

export type NameListId = typeof nameListIds[number]

export type NameListInfo = {
  id: NameListId
  name: string
  rncnSortOrder: number
}

export const nameLists: NameListInfo[] = [
  {
    id: "CLASS_NAMES",
    name: "Class Names",
    rncnSortOrder: 1,
  },
  {
    id: "TWINS_CLASS_NAMES",
    name: "Twins Class Names",
    rncnSortOrder: 3,
  },
  {
    id: "TRAINER_NAMES",
    name: "Trainer Names",
    rncnSortOrder: 0,
  },
  {
    id: "TWINS_TRAINER_NAMES",
    name: "Twins Trainer Names",
    rncnSortOrder: 2,
  },
  {
    id: "POKEMON_NICKNAMES",
    name: "Pokémon Nicknames",
    rncnSortOrder: 4,
  },
]