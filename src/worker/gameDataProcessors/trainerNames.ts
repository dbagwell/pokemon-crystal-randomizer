import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import type { Trainer } from "@shared/types/gameData/trainer"
import { isNotNullish } from "@shared/utils"
import { bytesFromTextData, inGameStringLength, truncateToInGameStringLength } from "@shared/utils/textConverters"
import type { Random } from "@worker/random"

export const updateTrainerNames = (
  playerOptions: PlayerOptions,
  gameData: PlayerSpecificGameData,
  random: Random,
) => {
  if (playerOptions.CHANGE_NAMES.VALUE) {
    const method = playerOptions.CHANGE_NAMES.SETTINGS.METHOD
    const trainerClasses = Object.values(gameData.trainerClasses)
    
    switch (method.VALUE) {
    case "SHUFFLED_TRAINERS": {
      // Shuffle class names
      
      const availableClassNames = trainerClasses.filter((trainerClasse) => {
        return trainerClasse.id !== "TWINS"
      }).map((trainerClass) => {
        return trainerClass.name
      })
      
      trainerClasses.filter((trainerClasse) => {
        return trainerClasse.id !== "TWINS"
      }).forEach((trainerClass) => {
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
      
      const allAvailableClassNames = method.SETTINGS.CUSTOM_LIST.CLASS_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 13)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      if (allAvailableClassNames.length > 0) {
        allAvailableClassNames.sort((a, b) => {
          return bytesFromTextData(a).length - bytesFromTextData(b).length
        })
      
        if (bytesFromTextData(allAvailableClassNames[0]).length > 7) {
          allAvailableClassNames.unshift("TRAINER")
        }
      
        let availableBytes = 502
        
        const trainerClassIndices = trainerClasses.map((_, index) => { return index })
        let availableClassNameIndices = allAvailableClassNames.map((_, index) => { return index })
        
        while (trainerClassIndices.length > 0) {
          const lengthOfShortestAvailableName = bytesFromTextData(allAvailableClassNames[0]).length
          const classesRemainingAfterNextSelection = trainerClassIndices.length - 1
          const minBytesStillRequiredAfterNextSelection = lengthOfShortestAvailableName * classesRemainingAfterNextSelection
          const maxLengthOfNextSelection = availableBytes - minBytesStillRequiredAfterNextSelection
          const indexOfLongestAvailableName = availableClassNameIndices[availableClassNameIndices.length - 1]
        
          if (availableClassNameIndices.length === 0 || maxLengthOfNextSelection < bytesFromTextData(allAvailableClassNames[indexOfLongestAvailableName]).length) {
            availableClassNameIndices = allAvailableClassNames.map((_, index) => {
              return index
            }).filter((index) => {
              return bytesFromTextData(allAvailableClassNames[index]).length <= maxLengthOfNextSelection
            })
          }
          
          const trainerClassIndex = random.element({
            array: trainerClassIndices,
            remove: true,
          })
          
          if (trainerClasses[trainerClassIndex].id === "TWINS") {
            continue
          }
          
          const classNameIndex = random.element({
            array: availableClassNameIndices,
            remove: true,
          })
        
          trainerClasses[trainerClassIndex].name = allAvailableClassNames[classNameIndex]
          availableBytes -= trainerClasses[trainerClassIndex].name.length
        }
      }
      
      // Randomize Twins Class Name
      
      const availableTwinsClassNames = method.SETTINGS.CUSTOM_LIST.TWINS_CLASS_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 13)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      if (availableTwinsClassNames.length > 0) {
        gameData.trainerClasses.TWINS.name = random.element({ array: availableTwinsClassNames })
      }
      
      // Randomize Trainer Names
      
      const singleTrainerNames = method.SETTINGS.CUSTOM_LIST.TRAINER_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 10)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      const twinsTrainerNames = method.SETTINGS.CUSTOM_LIST.TWINS_TRAINER_NAMES?.split("\n").map((name) => {
        return truncateToInGameStringLength(name, 10)
      }).filter((name) => {
        return name.length > 0
      }) ?? []
      
      const changedNames: Record<string, string> = {}
      
      gameData.trainers.filter((trainer) => {
        return trainer.name !== "???"
      }).forEach((trainer) => {
        const className = gameData.trainerClasses[trainer.classId].name
        
        if (
          isNotNullish(changedNames[className + trainer.name])
          && trainer.classId !== "ROCKET_GRUNT_M"
          && trainer.classId !== "ROCKET_GRUNT_F"
          && trainer.classId !== "ROCKET_EXECUTIVE_M"
          && trainer.classId !== "ROCKET_EXECUTIVE_F"
        ) {
          trainer.name = changedNames[className + trainer.name]
          return
        }
        
        const maxCombinedLength = trainer.isContestTrainer ?? false ? 16 : 17
        const maxNameLength = maxCombinedLength - inGameStringLength(className)
        const namesList = trainer.classId === "TWINS" ? twinsTrainerNames : singleTrainerNames
        let newName = truncateToInGameStringLength(trainer.name, maxNameLength)
        
        if (namesList.length > 0) {
          const validNames = namesList.filter((name) => {
            return inGameStringLength(className) + inGameStringLength(name) <= maxCombinedLength
          })
        
          newName = truncateToInGameStringLength(random.element({
            array: validNames.length > 0 ? validNames : namesList,
          }), maxNameLength)
        }
        
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