import type { OddEggOptionId } from "@shared/types/gameDataIds/oddEggOptions"

export type OddEggOption = {
  id: OddEggOptionId,
  label: string,
  description: string,
}