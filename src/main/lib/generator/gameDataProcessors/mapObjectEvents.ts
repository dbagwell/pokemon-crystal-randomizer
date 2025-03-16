import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { trainerMovementBehavioursMap } from "@shared/gameData/trainerMovementBehaviours"

export const updateMapObjectEvents = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
) => {
  if (!settings.CHANGE_OVERWORLD_TRAINER_MOVEMENT.VALUE) { return }
  
  const movementSettings = settings.CHANGE_OVERWORLD_TRAINER_MOVEMENT.SETTINGS
  const behaviour = trainerMovementBehavioursMap[movementSettings.MOVEMENT]
    
  romInfo.gameData.mapObjectEvents.forEach((event) => {
    if (
      event.typeId === "TRAINER"
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