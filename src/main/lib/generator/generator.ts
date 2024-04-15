import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import { AdditionalOptions } from "@shared/gameData/additionalOptions"
import { itemCategories } from "@shared/gameData/itemData"
import { compact, hexStringFrom, isNotNullish, isNumber, isString } from "@utils"
import { app } from "electron"
import hash from "object-hash"

export const generateROM = (data: Buffer, settings: any): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  let hunks: DataHunk[] = []
  
  if (isNotNullish(settings.other)) {
    const other = settings.other
    
    if (isNotNullish(other.additionalOptions)) {
      const additionalOptions = other.additionalOptions
      
      if (!Array.isArray(additionalOptions)) {
        throw new Error("'other.additionalOptions' must be an array.")
      }
      
      // TODO: Record warnings if array contains values that don't match expected values.
      // TODO: Pull additional options values from shared to ensure the ui sends the same values.
      
      const additionalOptionsPatch = Patch.fromYAML(
        romInfo,
        "additionalOptions.yml",
        {
          options: compact([
            additionalOptions.includes(AdditionalOptions.instantText) ? "options/textSpeedWithInstantText.yml" : "options/textSpeed.yml",
            additionalOptions.includes(AdditionalOptions.holdToMash) ? "options/holdToMash.yml" : null,
            "options/battleScene.yml",
            "options/battleShift.yml",
            additionalOptions.includes(AdditionalOptions.nicknames) ? "options/nicknames.yml" : null,
            "options/stereoSound.yml",
            additionalOptions.includes(AdditionalOptions.rideMusic) ? "options/rideMusic.yml" : null,
            "options/menuAccount.yml",
            "options/printTone.yml",
            "options/frameType.yml",
          ]),
        },
      )
      
      hunks = [...hunks, ...additionalOptionsPatch.hunks]
    }
  }
  
  if (isNotNullish(settings.items)) {
    const items = settings.items
    if (isNotNullish(items.startingInventory)) {
      const startingInventory = items.startingInventory
      
      let pokedexPartsValue = 0
      let pokegearPartsValue = 0
      let johtoBadgesValue = 0
      let kantoBadgesValue = 0
      const itemValues: {itemId: string, itemAmount: string}[] = []
      
      itemCategories.forEach((itemType) => {
        if (isNotNullish(startingInventory[itemType.id])) {
          const selectedItems = startingInventory[itemType.id]
          
          if (!Array.isArray(selectedItems)) {
            throw new Error(`'items.startingInventory.${itemType.id} must be an array.`)
          } else if (selectedItems.length > itemType.maxSlots) {
            throw new Error(`'items.startingInventory.${itemType.id}' cannot have more than ${itemType.maxSlots} entries.`)
          }
          
          const mappedItems = selectedItems.reduce((items, selectedItemInfo) => {
            if (isString(selectedItemInfo)) {
              return {
                ...items,
                [selectedItemInfo]: 1,
              }
            } else {
              return {
                ...items,
                ...selectedItemInfo,
              }
            }
          }, {})
          
          Object.entries(mappedItems).forEach(([itemId, amount]) => {
            const item = itemType.items.find((item) => { return item.id === itemId })
            if (isNotNullish(item)) {
              if (!isNumber(amount) || !Number.isInteger(amount) || amount > itemType.slotSize) {
                throw new Error(`Item amounts in 'items.startingInventory.${itemType.id}' cannot exceed ${itemType.slotSize}.`)
              }
              
              switch (item.type) {
              case "POKEDEX_PART": {
                pokedexPartsValue |= parseInt(item.hexId, 16)
                break
              }
              case "POKEGEAR_PART": {
                pokegearPartsValue |= parseInt(item.hexId, 16)
                break
              }
              case "JOHTO_BADGE": {
                johtoBadgesValue |= parseInt(item.hexId, 16)
                break
              }
              case "KANTO_BADGE": {
                kantoBadgesValue |= parseInt(item.hexId, 16)
                break
              }
              case "BAG_ITEM": {
                itemValues.push({
                  itemId: item.hexId,
                  itemAmount: `[2]{${amount}}`,
                })
                break
              }
              }
            } else {
              // TODO: Record warning.
            }
          })
        }
      })
      
      const startingItemsPatch = Patch.fromYAML(
        romInfo,
        "startingItems.yml",
        {
          items: itemValues.map((value) => {
            return {
              path: "giveItem.yml",
              extraValues: value,
            }
          }),
        },
        {
          pokedexParts: hexStringFrom([pokedexPartsValue]),
          pokegearParts: hexStringFrom([pokegearPartsValue]),
          johtoBadges: hexStringFrom([johtoBadgesValue]),
          kantoBadges: hexStringFrom([kantoBadgesValue]),
        }
      )
  
      hunks = [...hunks, ...startingItemsPatch.hunks]
    }
  }
  
  const checkValue = hunks.length > 0 ? hash(hunks).slice(0, 8).toUpperCase() : "00000000"
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion()), " "),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue), " "),
    },
  )
      
  hunks = [...hunks, ...basePatch.hunks]
  
  hunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}