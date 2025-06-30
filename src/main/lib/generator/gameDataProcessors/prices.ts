import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { itemIds } from "@shared/types/gameDataIds/items"
import { isNotNullish } from "@shared/utils"

export const updatePrices = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.CHANGE_DEFAULT_ITEM_PRICES.VALUE) {
    return
  }
  
  const priceSettings = settings.CHANGE_DEFAULT_ITEM_PRICES.SETTINGS
  const randomSettings = priceSettings.RANDOMIZE_PRICES.SETTINGS
  const cherrygroveSettings = randomSettings.LIMIT_CHERRYGROVE_PRICES.SETTINGS
  
  itemIds.forEach((itemId) => {
    const item = romInfo.gameData.items[itemId]
    
    if (priceSettings.RANDOMIZE_PRICES.VALUE && isNotNullish(randomSettings.OVERRIDES[itemId]?.PRICE)) {
      item.price = randomSettings.OVERRIDES[itemId].PRICE
      return
    }
    
    if (isNotNullish(priceSettings.CUSTOM_BASE_PRICES[itemId]?.PRICE)) {
      item.price = priceSettings.CUSTOM_BASE_PRICES[itemId]?.PRICE
    }
    
    if (!priceSettings.RANDOMIZE_PRICES.VALUE) {
      return
    }
    
    let min = randomSettings.ABSOLUTE_RANGE.MIN
    let max = randomSettings.ABSOLUTE_RANGE.MAX
    
    if (isNotNullish(randomSettings.MIN_PERCENTAGE)) {
      min = Math.max(min, Math.round(item.price * randomSettings.MIN_PERCENTAGE / 100))
    }
    
    if (isNotNullish(randomSettings.MAX_PERCENTAGE)) {
      max = Math.min(max, Math.round(item.price * randomSettings.MAX_PERCENTAGE / 100))
    }
    
    if (min > max) {
      throw new Error(`Error randomizing price of '${item.name}'. The minimum price '${min}' is greater than the maximum price '${max}'.`)
    }
    
    if (randomSettings.LIMIT_CHERRYGROVE_PRICES.VALUE && (romInfo.gameData.marts.CHERRYGROVE_1.items.includes(itemId) || romInfo.gameData.marts.CHERRYGROVE_2.items.includes(itemId))) {
      const newMin = Math.max(min, cherrygroveSettings.RANGE.MIN)
      const newMax = Math.min(max, cherrygroveSettings.RANGE.MAX)
      
      if (newMin >= max) {
        min = newMin
        max = newMin
      } else if (newMax <= min) {
        min = newMax
        max = newMax
      } else {
        min = newMin
        max = newMax
      }
    }
    
    if (randomSettings.PREFER_SIMILAR_PRICES) {
      const distanceToMin = Math.abs(item.price - min)
      const distanceToMax = Math.abs(max - item.price)
      const largerDistance = Math.max(distanceToMin, distanceToMax)
      const smallerDistance = Math.min(distanceToMin, distanceToMax)
      let newPrice = random.intFromNormalDistribution(item.price - largerDistance, item.price + largerDistance)
      
      if (newPrice < min || newPrice > max) {
        newPrice = random.intFromNormalDistribution(item.price - smallerDistance, item.price + smallerDistance)
      
        if (newPrice < min) {
          newPrice = min
        } else if (newPrice > max) {
          newPrice = max
        }
      }
      
      item.price = newPrice
    } else {
      item.price = random.int(min, max)
    }
  })
}