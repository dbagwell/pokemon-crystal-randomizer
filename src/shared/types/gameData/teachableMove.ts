import type { HMItemId, TMItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { MoveTutorId } from "@shared/types/gameDataIds/teachableMoves"

export type TeachableMove = ({
  id: TMItemId,
  type: "TM",
} | {
  id: HMItemId,
  type: "HM",
} | {
  id: MoveTutorId,
  type: "MOVE_TUTOR",
}) & {
  moveId: MoveId,
  byteIndex: number,
  bitIndex: number,
}