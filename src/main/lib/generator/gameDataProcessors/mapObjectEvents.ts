import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"

export const updateMapObjectEvents = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  if (settings.CHANGE_OVERWORLD_TRAINER_MOVEMENT.VALUE) {
    const movementSettings = settings.CHANGE_OVERWORLD_TRAINER_MOVEMENT.SETTINGS
    const behaviour = trainerMovementBehavioursMap[movementSettings.MOVEMENT]
    
    romInfo.gameData.mapObjectEvents.forEach((event) => {
      if (
        event.typeId === "TRAINER"
          && !movementSettings.EXCLUDE.some((behaviour) => {
            return trainerMovementBehavioursMap[behaviour].overworldMovementBehaviourId === event.movementBehaviourId
          })
          && (
            movementSettings.INCLUDE_STATIONARY
              || event.movementBehaviourId === "SPINCLOCKWISE"
              || event.movementBehaviourId === "SPINCOUNTERCLOCKWISE"
              || event.movementBehaviourId === "SPINRANDOM_SLOW"
              || event.movementBehaviourId === "SPINRANDOM_FAST"
          )
      ) {
        event.movementBehaviourId = behaviour.overworldMovementBehaviourId
      }
    })
  }
  
  if (settings.REMOVE_ROCKET_GRUNTS.includes("GOLDENROD_FLOWER_SHOP")) {
    romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "GOLDENROD_FLOWER_SHOP_ROCKET_GRUNT"
    })!.flagId = "INITIALIZED_EVENTS"
  }
  
  if (settings.REMOVE_ROCKET_GRUNTS.includes("GOLDENROD_SE_AREA")) {
    romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "GOLDENROD_SE_AREA_ROCKET_GRUNT"
    })!.flagId = "INITIALIZED_EVENTS"
  }
  
  if (settings.SHUFFLE_ITEMS.VALUE) {
    romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "GOLDENROD_UNDERGROUND_WAREHOUSE_DIRECTOR"
    })!.flagId = "DIRECTOR_IN_UNDERGROUND_WAREHOUSE"
  }
  
  if (settings.RADIO_CARD_QUIZ_ALWAYS_ACCESSIBLE) {
    romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "RADIO_TOWER_1F_RADIO_CARD_QUIZ_WOMAN"
    })!.flagId = undefined
  }
}