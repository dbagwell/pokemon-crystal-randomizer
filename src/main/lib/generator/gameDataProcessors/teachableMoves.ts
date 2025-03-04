import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { type Move, movesMap } from "@shared/gameData/moves"
import { isNullish } from "@shared/utils"

export const updateTeachableMoves = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number
) => {
  if (!settings.RANDOMIZE_TM_MOVES.VALUE && !settings.RANDOMIZE_MOVE_TUTOR_MOVES.VALUE) { return }
  
  if (settings.RANDOMIZE_TM_MOVES.VALUE) {
    const tmsSettings = settings.RANDOMIZE_TM_MOVES.SETTINGS
      
    const tms = Object.values(romInfo.gameData.teachableMoves).filter((move) => {
      return move.type === "TM"
    })
      
    let nonBannedMoves = Object.values(movesMap).filter((move) => {
      return !tmsSettings.BAN.includes(move.id)
    })
      
    const indicesOfForcedGoodMoves: number[] = []
    const minPowerForForcedGoodMoves = tmsSettings.GOOD_DAMAGING_MOVES.SETTINGS.POWER
      
    if (tmsSettings.GOOD_DAMAGING_MOVES.VALUE) {
      const guaranteedNumberOfGoodMoves = Math.ceil(tms.length * tmsSettings.GOOD_DAMAGING_MOVES.SETTINGS.PERCENTAGE / 100)
      const indicesOfAllMoves = Array(tms.length).map((_, index) => { return index })
      for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
        const index = indicesOfAllMoves.splice(randomInt(0, indicesOfAllMoves.length - 1), 1)[0]
        indicesOfForcedGoodMoves.push(index)
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
          
        const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
            ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
            ?? tertiaryChoices[randomInt(0, tertiaryChoices.length - 1)]
      
        if (isNullish(chosenMove)) {
          throw new Error("Unable to satisfy settings for randomized tm moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
        }
          
        tm.moveId = chosenMove.id
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
      return !moveTutorSettings.BAN.includes(move.id)
    })
      
    const indicesOfForcedGoodMoves: number[] = []
    const minPowerForForcedGoodMoves = moveTutorSettings.GOOD_DAMAGING_MOVES.SETTINGS.POWER
      
    if (moveTutorSettings.GOOD_DAMAGING_MOVES.VALUE) {
      const guaranteedNumberOfGoodMoves = Math.ceil(moveTutorMoves.length * moveTutorSettings.GOOD_DAMAGING_MOVES.SETTINGS.PERCENTAGE / 100)
      const indicesOfAllMoves = Array(moveTutorMoves.length).map((_, index) => { return index })
      for (let i = 0; i < guaranteedNumberOfGoodMoves; i++) {
        const index = indicesOfAllMoves.splice(randomInt(0, indicesOfAllMoves.length - 1), 1)[0]
        indicesOfForcedGoodMoves.push(index)
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
      const choices = nonBannedMoves.filter((move) => {
        return (!moveTutorSettings.PREFER_SAME_TYPE || move.type === movesMap[moveTutorMove.moveId].type)
            && matchesForcedGoodMovesConditions(move, index)
      })
        
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
        
      const chosenMove = primaryChoices[randomInt(0, primaryChoices.length - 1)]
          ?? secondaryChoices[randomInt(0, secondaryChoices.length - 1)]
          ?? tertiaryChoices[randomInt(0, tertiaryChoices.length - 1)]
    
      if (isNullish(chosenMove)) {
        throw new Error("Unable to satisfy settings for randomized move tutor moves. Possible reason: too many banned moves. You could try again with a different seed, but different settings might be required.")
      }
      
      moveTutorMove.moveId = choices[randomInt(0, choices.length - 1)].id
        
      if (moveTutorSettings.UNIQUE) {
        nonBannedMoves = nonBannedMoves.filter((move) => {
          return move.id !== moveTutorMove.moveId
        })
      }
    })
  }
}