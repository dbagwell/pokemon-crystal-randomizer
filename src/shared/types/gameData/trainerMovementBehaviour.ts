import type { OverworldMovementBehaviourId } from "@shared/types/gameDataIds/overworldMovementBehaviours"
import type { TrainerMovementBehaviourId } from "@shared/types/gameDataIds/trainerMovementBehaviours"

export type TrainerMovementBehaviour = {
  id: TrainerMovementBehaviourId
  numericId: number
  name: string
  fastSpinDurationMask: number
  overworldMovementBehaviourId: OverworldMovementBehaviourId
}