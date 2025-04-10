import { ROMInfo } from "@lib/gameData/romInfo"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ItemId } from "@shared/types/gameDataIds/items"

export const updateMarts = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  if (settings.CHERRYGROVE_MART_REPELS) {
    romInfo.gameData.marts.CHERRYGROVE_1.items.splice(1, 0, "REPEL")
    romInfo.gameData.marts.CHERRYGROVE_2.items.splice(2, 0, "REPEL")
  }
  
  if (settings.EARLY_CHARRGROVE_MART_POKE_BALLS) {
    romInfo.gameData.marts.CHERRYGROVE_1.items = []
  }
  
  if (settings.VIOLET_MART_REPELS) {
    romInfo.gameData.marts.VIOLET.items.splice(2, 0, "REPEL")
  }
  
  if (settings.BUYABLE_EVOLUTION_STONES) {
    romInfo.gameData.marts.GOLDENROD_4F.items.splice(0, 0, ...([
      "FIRE_STONE",
      "WATER_STONE",
      "LEAF_STONE",
      "THUNDERSTONE",
      "SUN_STONE",
      "MOON_STONE",
    ] as ItemId[]))
  }
  
  if (settings.BUYABLE_TM12) {
    romInfo.gameData.marts.GOLDENROD_5F_5.items = [
      ...romInfo.gameData.marts.GOLDENROD_5F_1.items,
      "TM12",
    ]
    
    romInfo.gameData.marts.GOLDENROD_5F_6.items = [
      ...romInfo.gameData.marts.GOLDENROD_5F_2.items,
      "TM12",
    ]
    
    romInfo.gameData.marts.GOLDENROD_5F_7.items = [
      ...romInfo.gameData.marts.GOLDENROD_5F_3.items,
      "TM12",
    ]
    
    romInfo.gameData.marts.GOLDENROD_5F_8.items = [
      ...romInfo.gameData.marts.GOLDENROD_5F_4.items,
      "TM12",
    ]
  }
}