import type { OverworldMovementBehaviour } from "@shared/types/gameData/overworldMovementBehaviour"
import type { OverworldMovementBehaviourId } from "@shared/types/gameDataIds/overworldMovementBehaviours"

export const overworldMovementBehavioursMap: IdMap<OverworldMovementBehaviourId, OverworldMovementBehaviour> = {
  STILL: {
    id: "STILL",
    numericId: 1,
  },
  WANDER: {
    id: "WANDER",
    numericId: 2,
  },
  SPINRANDOM_SLOW: {
    id: "SPINRANDOM_SLOW",
    numericId: 3,
  },
  WALK_UP_DOWN: {
    id: "WALK_UP_DOWN",
    numericId: 4,
  },
  WALK_LEFT_RIGHT: {
    id: "WALK_LEFT_RIGHT",
    numericId: 5,
  },
  STANDING_DOWN: {
    id: "STANDING_DOWN",
    numericId: 6,
  },
  STANDING_UP: {
    id: "STANDING_UP",
    numericId: 7,
  },
  STANDING_LEFT: {
    id: "STANDING_LEFT",
    numericId: 8,
  },
  STANDING_RIGHT: {
    id: "STANDING_RIGHT",
    numericId: 9,
  },
  SPINRANDOM_FAST: {
    id: "SPINRANDOM_FAST",
    numericId: 10,
  },
  PLAYER: {
    id: "PLAYER",
    numericId: 11,
  },
  FOLLOWING: {
    id: "FOLLOWING",
    numericId: 19,
  },
  SCRIPTED: {
    id: "SCRIPTED",
    numericId: 20,
  },
  BIGDOLLSYM: {
    id: "BIGDOLLSYM",
    numericId: 21,
  },
  POKEMON: {
    id: "POKEMON",
    numericId: 22,
  },
  SUDOWOODO: {
    id: "SUDOWOODO",
    numericId: 23,
  },
  SMASHABLE_ROCK: {
    id: "SMASHABLE_ROCK",
    numericId: 24,
  },
  STRENGTH_BOULDER: {
    id: "STRENGTH_BOULDER",
    numericId: 25,
  },
  FOLLOWNOTEXACT: {
    id: "FOLLOWNOTEXACT",
    numericId: 26,
  },
  SHADOW: {
    id: "SHADOW",
    numericId: 27,
  },
  EMOTE: {
    id: "EMOTE",
    numericId: 28,
  },
  SCREENSHAKE: {
    id: "SCREENSHAKE",
    numericId: 29,
  },
  SPINCOUNTERCLOCKWISE: {
    id: "SPINCOUNTERCLOCKWISE",
    numericId: 30,
  },
  SPINCLOCKWISE: {
    id: "SPINCLOCKWISE",
    numericId: 31,
  },
  BIGDOLLASYM: {
    id: "BIGDOLLASYM",
    numericId: 32,
  },
  BIGDOLL: {
    id: "BIGDOLL",
    numericId: 33,
  },
  BOULDERDUST: {
    id: "BOULDERDUST",
    numericId: 34,
  },
  GRASS: {
    id: "GRASS",
    numericId: 35,
  },
  SWIM_WANDER: {
    id: "SWIM_WANDER",
    numericId: 36,
  },
} as const