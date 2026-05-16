import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import type { Trainer } from "@shared/types/gameData/trainer"
import { bytesFromTextData, inGameStringLength, truncateToInGameStringLength } from "@shared/utils/textConverters"
import type { Random } from "@worker/random"

export const updateTrainerNames = (
  playerOptions: PlayerOptions,
  gameData: PlayerSpecificGameData,
  random: Random,
) => {
  if (playerOptions.CHANGE_TRAINER_NAMES.VALUE) {
    const method = playerOptions.CHANGE_TRAINER_NAMES.SETTINGS.METHOD
    const trainerClasses = Object.values(gameData.trainerClasses)
    
    switch (method.VALUE) {
    case "SHUFFLED": {
      // Shuffle class names
      
      const availableClassNames = trainerClasses.map((trainerClass) => {
        return trainerClass.name
      })
      
      trainerClasses.forEach((trainerClass) => {
        trainerClass.name = random.element({
          array: availableClassNames,
          remove: true,
        })
      })
      
      // Shuffle single trainer names
      
      const maxNameLength = (trainer: Trainer) => {
        const className = gameData.trainerClasses[trainer.classId].name
        const combinedMaxLength = trainer.isContestTrainer ?? false ? 16 : 17
        return combinedMaxLength - inGameStringLength(className)
      }
      
      const singleTrainers = gameData.trainers.filter((trainer) => {
        return trainer.classId !== "TWINS" && trainer.name !== "???"
      }).toSorted((a, b) => {
        return maxNameLength(a) - maxNameLength(b)
      })
      
      const singleTrainerNames = singleTrainers.map((trainer) => {
        return trainer.name
      })
      
      singleTrainers.forEach((trainer) => {
        const validNameIndices = singleTrainerNames.reduce((result, name, index) => {
          if (inGameStringLength(name) <= maxNameLength(trainer)) {
            return [...result, index]
          } else {
            return result
          }
        }, [] as number[])
        
        const index = random.element({ array: validNameIndices })
        trainer.name = singleTrainerNames[index]
        singleTrainerNames.splice(index, 1)
      })
      
      // Shuffle twin trainer names
      
      const twinTrainers = gameData.trainers.filter((trainer) => {
        return trainer.classId === "TWINS"
      })
      
      const twinTrainerNames = twinTrainers.map((trainer) => {
        return trainer.name
      })
      
      twinTrainers.forEach((trainer) => {
        trainer.name = random.element({
          array: twinTrainerNames,
          remove: true,
        })
      })
      
      break
    }
    case "CUSTOM_LIST": {
      // Randomize class names
      
      const availableClassNames = method.SETTINGS.CUSTOM_LIST.ClASS_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 13)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      if (availableClassNames.length > 1) {
        availableClassNames.sort((a, b) => {
          return bytesFromTextData(a).length - bytesFromTextData(b).length
        })
      
        if (bytesFromTextData(availableClassNames[0]).length > 7) {
          availableClassNames.unshift("TRAINER")
        }
      
        let availableBytes = 502
      
        let classNameIndex = 0
        const trainerClassIndices = trainerClasses.map((_, index) => { return index })
        while (trainerClassIndices.length > 0) {
          const trainerClassIndex = random.element({
            array: trainerClassIndices,
            remove: true,
          })
        
          trainerClasses[trainerClassIndex].name = availableClassNames[classNameIndex]
          availableBytes -= trainerClasses[trainerClassIndex].name.length
        
          classNameIndex++
        
          if (classNameIndex === availableClassNames.length || availableClassNames[0].length * (trainerClassIndices.length - 1) > availableBytes - availableClassNames[classNameIndex].length) {
            classNameIndex = 0
          }
        }
      }
      
      // Randomize Trainer Names
      
      const singleTrainerNames = method.SETTINGS.CUSTOM_LIST.TRAINER_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 10)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      const twinTrainerNames = method.SETTINGS.CUSTOM_LIST.TWIN_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 10)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      const changedNames: Record<string, string> = {}
      
      gameData.trainers.filter((trainer) => {
        return trainer.name !== "???"
      }).forEach((trainer) => {
        const className = gameData.trainerClasses[trainer.classId].name
        
        if (changedNames[className + trainer.name]) {
          trainer.name = changedNames[className + trainer.name]
          return
        }
        
        const maxCombinedLength = trainer.isContestTrainer ?? false ? 16 : 17
        const namesList = trainer.classId === "TWINS" ? twinTrainerNames : singleTrainerNames
        const validNames = namesList.filter((name) => {
          return inGameStringLength(className) + inGameStringLength(name) <= maxCombinedLength
        })
        
        const newName = random.element({
          array: validNames.length > 0 ? validNames : trainer.classId === "TWINS" ? ["T&T"] : ["BOB"],
        })
        
        changedNames[className + trainer.name] = newName
        trainer.name = newName
      })
      
      break
    }
    default: {
      const unhandledCase: never = method.VALUE
      throw new Error(`Unhandled case: ${unhandledCase}`)
    }
    }
  }
}