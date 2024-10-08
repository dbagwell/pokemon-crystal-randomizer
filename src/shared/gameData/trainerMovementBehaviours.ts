import type { TrainerMovementBehaviour } from "@shared/types/gameData/trainerMovementBehaviour"
import type { TrainerMovementBehaviourId } from "@shared/types/gameDataIds/trainerMovementBehaviours"

export const trainerMovementBehavioursMap: IdMap<TrainerMovementBehaviourId, TrainerMovementBehaviour> = {
  ROTATE_CLOCKWISE: {
    id: "ROTATE_CLOCKWISE",
    numericId: 0x1F,
    name: "Rotate Clockwise",
    fastSpinDurationMask: 0b00011111,
    overworldMovementBehaviourId: "SPINCLOCKWISE",
  },
  ROTATE_COUNTER_CLOCKWISE: {
    id: "ROTATE_COUNTER_CLOCKWISE",
    numericId: 0x1E,
    name: "Rotate Counter Clockwise",
    fastSpinDurationMask: 0b00011111,
    overworldMovementBehaviourId: "SPINCOUNTERCLOCKWISE",
  },
  PIVOT_RANDOMLY_SLOW: {
    id: "PIVOT_RANDOMLY_SLOW",
    numericId: 0x03,
    name: "Pivot Randomly (Slow)",
    fastSpinDurationMask: 0b00011111,
    overworldMovementBehaviourId: "SPINRANDOM_SLOW",
  },
  PIVOT_RANDOMLY_FAST: {
    id: "PIVOT_RANDOMLY_FAST",
    numericId: 0x0A,
    name: "Pivot Randomly (Fast)",
    fastSpinDurationMask: 0b00011111,
    overworldMovementBehaviourId: "SPINRANDOM_FAST",
  },
  PIVOT_RANDOMLY_SUPER_FAST: {
    id: "PIVOT_RANDOMLY_SUPER_FAST",
    numericId: 0x0A,
    name: "Pivot Randomly (Super Fast)",
    fastSpinDurationMask: 0b00001111,
    overworldMovementBehaviourId: "SPINRANDOM_FAST",
  },
  PIVOT_RANDOMLY_HYPER_FAST: {
    id: "PIVOT_RANDOMLY_HYPER_FAST",
    numericId: 0x0A,
    name: "Pivot Randomly (Hyper Fast)",
    fastSpinDurationMask: 0b00000111,
    overworldMovementBehaviourId: "SPINRANDOM_FAST",
  },
}