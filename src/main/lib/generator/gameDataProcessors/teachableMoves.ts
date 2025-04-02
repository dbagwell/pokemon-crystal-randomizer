import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { type Move, movesMap } from "@shared/gameData/moves"

export const updateTeachableMoves = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_TM_MOVES.VALUE && !settings.RANDOMIZE_MOVE_TUTOR_MOVES.VALUE) { return }
  
  if (settings.RANDOMIZE_TM_MOVES.VALUE) {
    const tmsSettings = settings.RANDOMIZE_TM_MOVES.SETTINGS
      
    const tms = Object.values(romInfo.gameData.teachableMoves).filter((move) => {
      return move.type === "TM"
    })
      
    let nonBannedMoves = Object.values(movesMap).filter((move) => {
      return !settings.BANNED_MOVES.includes(move.id) && !tmsSettings.BAN.includes(move.id)
    })
      
    const indicesOfForcedGoodMoves: number[] = []
    const minPowerForForcedGoodMoves = tmsSettings.GOOD_DAMAGING_MOVES.SETTINGS.POWER
      
    if (tmsSettings.GOOD_DAMAGING_MOVES.VALUE) {
      const guaranteedNumberOfGoodMoves = Math.ceil(tms.length * tmsSettings.GOOD_DAMAGING_MOVES.SETTINGS.PERCENTAGE / 100)
      const indicesOfAllMoves = Array(tms.length).fill(0).map((_, index) => { return index })
      for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
        indicesOfForcedGoodMoves.push(random.element({ array: indicesOfAllMoves, remove: true }))
      }
    }
      
    const matchesForcedGoodMovesConditions = (move: Move, index: number) => {
      if (indicesOfForcedGoodMoves.includes(index)) {
        return move.power >= minPowerForForcedGoodMoves
      } else {
        return true
      }
    }
      
    tms.forEach((tm, index) => {
      if (!tmsSettings.KEEP_FIELD_MOVES || !movesMap[tm.moveId].isFieldMove) {
        const primaryChoices: Move[] = []
        const secondaryChoices: Move[] = []
        const tertiaryChoices: Move[] = []
          
        nonBannedMoves.forEach((move) => {
          if (!tmsSettings.PREFER_SAME_TYPE || move.type === movesMap[tm.moveId].type) {
            if (matchesForcedGoodMovesConditions(move, index)) {
              primaryChoices.push(move)
            } else {
              secondaryChoices.push(move)
            }
          } else if (matchesForcedGoodMovesConditions(move, index)) {
            secondaryChoices.push(move)
          } else {
            tertiaryChoices.push(move)
          }
        })
          
        tm.moveId = random.element({ array: primaryChoices, allowUndefined: true }).id
          ?? random.element({ array: secondaryChoices, allowUndefined: true }).id
          ?? random.element({
            array: tertiaryChoices,
            errorInfo: {
              elementName: "move",
              mainSettingName: "RANDOMIZE_TM_MOVES",
              conflictingSettings: [
                "RANDOMIZE_TM_MOVES.SETTINGS.UNIQUE",
                "RANDOMIZE_TM_MOVES.SETTINGS.BAN",
                "BANNED_MOVES",
              ],
            },
          }).id
      }
        
      if (tmsSettings.UNIQUE) {
        nonBannedMoves = nonBannedMoves.filter((move) => {
          return move.id !== tm.moveId
        })
      }
    })
  }
    
  if (settings.RANDOMIZE_MOVE_TUTOR_MOVES.VALUE) {
    const moveTutorSettings = settings.RANDOMIZE_MOVE_TUTOR_MOVES.SETTINGS
      
    const moveTutorMoves = Object.values(romInfo.gameData.teachableMoves).filter((move) => {
      return move.type === "MOVE_TUTOR"
    })
      
    let nonBannedMoves = Object.values(movesMap).filter((move) => {
      return !settings.BANNED_MOVES.includes(move.id) && !moveTutorSettings.BAN.includes(move.id)
    })
      
    const indicesOfForcedGoodMoves: number[] = []
    const minPowerForForcedGoodMoves = moveTutorSettings.GOOD_DAMAGING_MOVES.SETTINGS.POWER
      
    if (moveTutorSettings.GOOD_DAMAGING_MOVES.VALUE) {
      const guaranteedNumberOfGoodMoves = Math.ceil(moveTutorMoves.length * moveTutorSettings.GOOD_DAMAGING_MOVES.SETTINGS.PERCENTAGE / 100)
      const indicesOfAllMoves = Array(moveTutorMoves.length).fill(0).map((_, index) => { return index })
      for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
        indicesOfForcedGoodMoves.push(random.element({ array: indicesOfAllMoves, remove: true }))
      }
    }
      
    const matchesForcedGoodMovesConditions = (move: Move, index: number) => {
      if (indicesOfForcedGoodMoves.includes(index)) {
        return move.power >= minPowerForForcedGoodMoves
      } else {
        return true
      }
    }
      
    moveTutorMoves.forEach((moveTutorMove, index) => {
      const primaryChoices: Move[] = []
      const secondaryChoices: Move[] = []
      const tertiaryChoices: Move[] = []
        
      nonBannedMoves.forEach((move) => {
        if (!moveTutorSettings.PREFER_SAME_TYPE || move.type === movesMap[moveTutorMove.moveId].type) {
          if (matchesForcedGoodMovesConditions(move, index)) {
            primaryChoices.push(move)
          } else {
            secondaryChoices.push(move)
          }
        } else if (matchesForcedGoodMovesConditions(move, index)) {
          secondaryChoices.push(move)
        } else {
          tertiaryChoices.push(move)
        }
      })
      
      moveTutorMove.moveId = random.element({ array: primaryChoices, allowUndefined: true }).id
        ?? random.element({ array: secondaryChoices, allowUndefined: true }).id
        ?? random.element({
          array: tertiaryChoices,
          errorInfo: {
            elementName: "move",
            mainSettingName: "RANDOMIZE_MOVE_TUTOR_MOVES",
            conflictingSettings: [
              "RANDOMIZE_MOVE_TUTOR_MOVES.SETTINGS.UNIQUE",
              "RANDOMIZE_MOVE_TUTOR_MOVES.SETTINGS.BAN",
              "BANNED_MOVES",
            ],
          },
        }).id
        
      if (moveTutorSettings.UNIQUE) {
        nonBannedMoves = nonBannedMoves.filter((move) => {
          return move.id !== moveTutorMove.moveId
        })
      }
    })
  }
}