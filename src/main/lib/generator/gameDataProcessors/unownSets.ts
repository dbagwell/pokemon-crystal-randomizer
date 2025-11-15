import type { ROMInfo } from "@lib/gameData/romInfo";
import type { Random } from "@lib/generator/random";
import type { Settings } from "@shared/appData/settingsFromViewModel";
import { unownLetterIds } from "@shared/types/gameDataIds/unownLetters";

export const updateUnownSets = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.CHANGE_UNOWN_SETS.VALUE) {
    return
  }
  
  const unownSettings = settings.CHANGE_UNOWN_SETS.SETTINGS
  
  let kabutoSetSize = romInfo.gameData.unownSets.KABUTO_PUZZLE.length
  let omayteSetSize = romInfo.gameData.unownSets.OMANYTE_PUZZLE.length
  let aerodactylSetSize = romInfo.gameData.unownSets.AERODACTYL_PUZZLE.length
  let hoOhSetSize = romInfo.gameData.unownSets.HO_OH_PUZZLE.length
  
  romInfo.gameData.unownSets = {
    KABUTO_PUZZLE: [],
    OMANYTE_PUZZLE: [],
    AERODACTYL_PUZZLE: [],
    HO_OH_PUZZLE: [],
  }
  
  if (unownSettings.METHOD.VALUE === "RANDOM") {
    if (unownSettings.METHOD.SETTINGS.RANDOM.DISTRIBUTION === "RANDOM") {
      kabutoSetSize = random.int(0, 26)
      omayteSetSize = random.int(0, 26 - kabutoSetSize)
      aerodactylSetSize = random.int(0, 26 - kabutoSetSize - omayteSetSize)
      hoOhSetSize = 26 - kabutoSetSize - omayteSetSize - aerodactylSetSize
    } else if (unownSettings.METHOD.SETTINGS.RANDOM.DISTRIBUTION === "BALANCED") {
      kabutoSetSize = 7
      omayteSetSize = 7
      aerodactylSetSize = 6
      hoOhSetSize = 6
    }
    
    let possibleLetters = [...unownLetterIds]
    
    for (let i = 0; i < kabutoSetSize; i++) {
      romInfo.gameData.unownSets.KABUTO_PUZZLE.push(random.element({
        array: possibleLetters,
        remove: true,
      }))
    }
    
    if (!unownSettings.METHOD.SETTINGS.RANDOM.PREVENT_DUPLICATES) {
      possibleLetters = [...unownLetterIds]
    }
    
    for (let i = 0; i < omayteSetSize; i++) {
      romInfo.gameData.unownSets.OMANYTE_PUZZLE.push(random.element({
        array: possibleLetters,
        remove: true,
      }))
    }
    
    if (!unownSettings.METHOD.SETTINGS.RANDOM.PREVENT_DUPLICATES) {
      possibleLetters = [...unownLetterIds]
    }
    
    for (let i = 0; i < aerodactylSetSize; i++) {
      romInfo.gameData.unownSets.AERODACTYL_PUZZLE.push(random.element({
        array: possibleLetters,
        remove: true,
      }))
    }
    
    if (!unownSettings.METHOD.SETTINGS.RANDOM.PREVENT_DUPLICATES) {
      possibleLetters = [...unownLetterIds]
    }
    
    for (let i = 0; i < hoOhSetSize; i++) {
      romInfo.gameData.unownSets.HO_OH_PUZZLE.push(random.element({
        array: possibleLetters,
        remove: true,
      }))
    }
    
  } else {
    romInfo.gameData.unownSets.KABUTO_PUZZLE = [...unownLetterIds]
  }
}