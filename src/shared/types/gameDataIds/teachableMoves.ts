import type { HMItemId, TMItemId } from "@shared/types/gameDataIds/items"

export const moveTutorIds = [
  "MOVE_TUTOR_1",
  "MOVE_TUTOR_2",
  "MOVE_TUTOR_3",
] as const

export type MoveTutorId = typeof moveTutorIds[number]

export type TeachableMoveId = TMItemId | HMItemId | MoveTutorId