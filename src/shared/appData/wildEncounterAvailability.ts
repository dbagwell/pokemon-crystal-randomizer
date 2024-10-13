export const wildEncounterAvailabilityOptions = [
  {
    id: "RANDOM" as const,
    label: "Random",
    description: "All encounters are completely random. Some Pokémon might not be available as wild encounter.",
  },
  {
    id: "FULL" as const,
    label: "Full",
    description: "All species of Pokémon that aren't banned are guaranteed to exist as at least one wild encounter, unless too many slots are forced to be fully evolved.",
  },
  {
    id: "SEARCHABLE" as const,
    label: "Pokédex Searchable",
    description: "All species of Pokémon that aren't banned are guaranteed to exist as at least one wild encounter that is visible in the Pokédex (in the tall grass, in caves, or on the water), unless too many slots are forced to be fully evolved.",
  },
  {
    id: "REGIONAL" as const,
    label: "Regional",
    description: "Same as 'Pokédex Searchable', but the rules are applied to each region separately.",
  },
]