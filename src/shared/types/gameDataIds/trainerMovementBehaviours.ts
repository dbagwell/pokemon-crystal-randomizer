export const trainerMovementBehaviourIds = [
  "ROTATE_CLOCKWISE",
  "ROTATE_COUNTER_CLOCKWISE",
  "PIVOT_RANDOMLY_SLOW",
  "PIVOT_RANDOMLY_FAST",
  "PIVOT_RANDOMLY_SUPER_FAST",
  "PIVOT_RANDOMLY_HYPER_FAST",
] as const

export type TrainerMovementBehaviourId = typeof trainerMovementBehaviourIds[number]