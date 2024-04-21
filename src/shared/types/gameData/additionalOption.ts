import type { AdditionalOptionId } from "@shared/types/gameDataIds/additionalOptions"

export type AdditionalOption = {
  id: AdditionalOptionId,
  name: string,
  description: string,
}