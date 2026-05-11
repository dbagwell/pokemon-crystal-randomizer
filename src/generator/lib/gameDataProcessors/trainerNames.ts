import type { Random } from "@mainShared/random"
import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import { bytesFromTextData, inGameStringLength, truncateToInGameStringLength } from "@shared/utils/textConverters"

export const updateTrainerClassNames = (
  playerOptions: PlayerOptions,
  gameData: PlayerSpecificGameData,
  random: Random,
) => {
  if (playerOptions.CHANGE_TRAINER_CLASS_NAMES) {
    const method = playerOptions.CHANGE_TRAINER_CLASS_NAMES.SETTINGS.METHOD
    const trainerClasses = Object.values(gameData.trainerClasses)
    
    switch (method.VALUE) {
    case "SHUFFLED": {
      const classNames = trainerClasses.map((trainerClass) => {
        return trainerClass.name
      })
      
      trainerClasses.forEach((trainerClass) => {
        trainerClass.name = random.element({
          array: classNames,
          remove: true,
        })
      })
      
      break
    }
    case "CUSTOM_LIST": {
      let classNames = method.SETTINGS.CUSTOM_LIST.ClASS_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 13)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      const numberOfCustomNames = classNames.length
      
      if (numberOfCustomNames < 1) {
        classNames = ["TRAINER"]
      }
      
      classNames.sort((a, b) => {
        return bytesFromTextData(a).length - bytesFromTextData(b).length
      })
      
      if (classNames[0].length > 7) {
        classNames = ["TRAINER"]
      }
      
      let availableBytes = 502
      
      let classNameIndex = 0
      const trainerClassIndices = trainerClasses.map((_, index) => { return index })
      while (trainerClassIndices.length > 0) {
        const trainerClassIndex = random.element({
          array: trainerClassIndices,
          remove: true,
        })
        
        trainerClasses[trainerClassIndex].name = classNames[classNameIndex]
        availableBytes -= trainerClasses[trainerClassIndex].name.length
        
        classNameIndex++
        
        if (classNameIndex === classNames.length || classNames[0].length * (trainerClassIndices.length - 1) > availableBytes - classNames[classNameIndex].length) {
          classNameIndex = 0
        }
      }
      
      break
    }
    default: {
      const unhandledCase: never = method.VALUE
      throw new Error(`Unhandled case: ${unhandledCase}`)
    }
    }
  }
}

export const updateTrainerNames = (
  playerOptions: PlayerOptions,
  gameData: PlayerSpecificGameData,
  random: Random,
) => {
  if (playerOptions.CHANGE_TRAINER_NAMES.VALUE) {
    const method = playerOptions.CHANGE_TRAINER_NAMES.SETTINGS.METHOD
    switch (method.VALUE) {
    case "SHUFFLED": {
      const singleTrainers = gameData.trainers.filter((trainer) => {
        return trainer.classId !== "TWINS" && trainer.name !== "???"
      })
      
      const singleTrainerNames = singleTrainers.map((trainer) => {
        return trainer.name
      })
      
      singleTrainers.filter((trainer) => {
        return trainer.isContestTrainer ?? false
      }).forEach((trainer) => {
        const className = gameData.trainerClasses[trainer.classId].name
        const validNameIndices = singleTrainerNames.reduce((result, name, index) => {
          if (inGameStringLength(className) + inGameStringLength(name) < 17) {
            return [...result, index]
          } else {
            return result
          }
        }, [] as number[])
        
        const index = random.element({
          array: validNameIndices,
          remove: true,
        })
        
        trainer.name = singleTrainerNames[index]
        singleTrainerNames.splice(index, 1)
      })
      
      singleTrainers.filter((trainer) => {
        return !(trainer.isContestTrainer ?? false)
      }).forEach((trainer) => {
        trainer.name = random.element({
          array: singleTrainerNames,
          remove: true,
        })
      })
      
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