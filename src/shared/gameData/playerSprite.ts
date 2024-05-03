import type { PlayerSprite } from "@shared/types/gameData/playerSprites"
import type { PlayerSpriteId } from "@shared/types/gameDataIds/playerSprites"

export const playerSpriteMap: IdMap<PlayerSpriteId, PlayerSprite> = {
  BOY: {
    id: "BOY",
    label: "Boy",
    numericId: 0,
  },
  GIRL: {
    id: "GIRL",
    label: "Girl",
    numericId: 1,
  },
}