import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { type Move, movesMap } from "@shared/gameData/moves"
import { moveIds } from "@shared/types/gameDataIds/moves"

export const updateLevelUpMoves = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.RANDOMIZE_LEVEL_UP_MOVES.VALUE) { return }
  
  const levelUpMovesSettings = settings.RANDOMIZE_LEVEL_UP_MOVES.SETTINGS
    
  const nonBannedMoveIds = moveIds.filter((moveId) => {
    return !settings.BANNED_MOVES.includes(moveId) && !levelUpMovesSettings.BAN.includes(moveId)
  })
    
  Object.values(romInfo.gameData.pokemon).forEach((pokemon) => {
    let moveChoices = nonBannedMoveIds.map((moveId) => {
      return movesMap[moveId]
    })
      
    const numberOfLevelOneMovesToAdd = (levelUpMovesSettings.GUARANTEE_LEVEL_ONE_MOVES.VALUE ? levelUpMovesSettings.GUARANTEE_LEVEL_ONE_MOVES.SETTINGS.MINIMUM : 0) - pokemon.levelUpMoves.filter((levelUpMove) => { return levelUpMove.level === 1 }).length
    const totalNumberOfMoves = numberOfLevelOneMovesToAdd + pokemon.levelUpMoves.length
    const indicesOfForcedGoodMoves: number[] = []
    const minPowerForForcedGoodMoves = levelUpMovesSettings.GOOD_DAMAGING_MOVES.SETTINGS.POWER
      
    if (levelUpMovesSettings.GOOD_DAMAGING_MOVES.VALUE) {
      const guaranteedNumberOfGoodMoves = Math.ceil(totalNumberOfMoves * levelUpMovesSettings.GOOD_DAMAGING_MOVES.SETTINGS.PERCENTAGE / 100)
      const indicesOfAllMoves = Array(totalNumberOfMoves).fill(0).map((_, index) => { return index })
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
      
    pokemon.levelUpMoves.forEach((levelUpMove, index) => {
      const adjustedIndex = index + numberOfLevelOneMovesToAdd
        
      const primaryChoices: Move[] = []
      const secondaryChoices: Move[] = []
      const tertiaryChoices: Move[] = []
        
      moveChoices.forEach((move) => {
        if (!levelUpMovesSettings.PREFER_SAME_TYPE || move.type === movesMap[levelUpMove.moveId].type) {
          if (matchesForcedGoodMovesConditions(move, adjustedIndex)) {
            primaryChoices.push(move)
          } else {
            secondaryChoices.push(move)
          }
        } else if (matchesForcedGoodMovesConditions(move, adjustedIndex)) {
          secondaryChoices.push(move)
        } else {
          tertiaryChoices.push(move)
        }
      })
        
      const chosenMove = random.element({ array: primaryChoices, allowUndefined: true })
        ?? random.element({ array: secondaryChoices, allowUndefined: true })
        ?? random.element({
          array: tertiaryChoices,
          errorInfo: {
            elementName: "move",
            mainSettingName: "RANDOMIZE_LEVEL_UP_MOVES",
            conflictingSettings: [
              "RANDOMIZE_LEVEL_UP_MOVES.SETTINGS.UNIQUE",
              "RANDOMIZE_LEVEL_UP_MOVES.SETTINGS.GUARANTEE_LEVEL_ONE_MOVES",
              "RANDOMIZE_LEVEL_UP_MOVES.SETTINGS.BAN",
              "BANNED_MOVES",
            ],
          },
        })
        
      levelUpMove.moveId = chosenMove.id
        
      if (levelUpMovesSettings.UNIQUE) {
        moveChoices = moveChoices.filter((move) => {
          return move.id !== chosenMove.id
        })
      }
    })
      
    for (let i = 0; i < numberOfLevelOneMovesToAdd; i++) {
      const primaryChoices: Move[] = []
      const secondaryChoices: Move[] = []
        
      moveChoices.forEach((move) => {
        if (matchesForcedGoodMovesConditions(move, i)) {
          primaryChoices.push(move)
        } else {
          secondaryChoices.push(move)
        }
      })
        
      const chosenMove = random.element({ array: primaryChoices, allowUndefined: true }) ?? random.element({
        array: secondaryChoices,
        errorInfo: {
          elementName: "move",
          mainSettingName: "RANDOMIZE_LEVEL_UP_MOVES",
          conflictingSettings: [
            "RANDOMIZE_LEVEL_UP_MOVES.SETTINGS.UNIQUE",
            "RANDOMIZE_LEVEL_UP_MOVES.SETTINGS.BAN",
            "BANNED_MOVES",
          ],
        },
      })
        
      pokemon.levelUpMoves.push({
        moveId: chosenMove.id,
        level: 1,
      })
        
      if (levelUpMovesSettings.UNIQUE) {
        moveChoices = moveChoices.filter((move) => {
          return move.id !== chosenMove.id
        })
      }
    }
        
    pokemon.levelUpMoves.sort((move1, move2) => {
      return move1.level - move2.level
    })
      
    if (levelUpMovesSettings.PROGRESSIVE) {
      const sortedDamagingMoves = pokemon.levelUpMoves.map((levelUpMove) => {
        return movesMap[levelUpMove.moveId]
      }).filter((move) => {
        return move.power !== 0
      }).toSorted((move1, move2) => {
        return move1.power - move2.power
      })
        
      pokemon.levelUpMoves.forEach((levelUpMove) => {
        levelUpMove.moveId = movesMap[levelUpMove.moveId].power === 0 ? levelUpMove.moveId : sortedDamagingMoves.splice(0, 1)[0].id
      })
    }
  })
    
  romInfo.gameData.trainers.forEach((trainer) => {
    trainer.pokemon.forEach((pokemon) => {
      pokemon.moves = []
    })
  })
}