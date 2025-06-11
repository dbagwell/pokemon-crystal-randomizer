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
    
    const object = romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "ILEX_FOREST_LASS"
    })
    
    object!.coordinate = [9, 23]
    object!.movementBehaviourId = "STANDING_LEFT"
  }
  
  if (settings.RADIO_CARD_QUIZ_ALWAYS_ACCESSIBLE) {
    romInfo.gameData.mapObjectEvents.find((object) => {
      return object.id === "RADIO_TOWER_1F_RADIO_CARD_QUIZ_WOMAN"
    })!.flagId = undefined
  }
  
  if (settings.RANDOMIZE_REGULAR_ITEM_BALLS.VALUE || settings.SHUFFLE_ITEMS.VALUE) {
    const object = romInfo.gameData.mapObjectEvents.find((event) => {
      return event.flagId === "DRAGONS_DEN_B1F_DRAGON_FANG"
    })!
    
    object.typeId = "ITEMBALL"
    object.scriptPointer++
  }
  
  if (settings.SINGLE_USE_FRUIT_TREES) {
    romInfo.gameData.mapObjectEvents.forEach((object) => {
      if (object.spriteId === "FRUIT_TREE") {
        object.typeId = "ITEMBALL"
      }
      
      switch (object.id) {
      case "ROUTE_1_FRUIT_TREE": object.flagId = "GOT_ROUTE_1_FRUIT_TREE"; break
      case "ROUTE_2_FOREST_AREA_FRUIT_TREE": object.flagId = "GOT_ROUTE_2_FOREST_AREA_FRUIT_TREE"; break
      case "ROUTE_8_FRUIT_TREE": object.flagId = "GOT_ROUTE_8_FRUIT_TREE"; break
      case "ROUTE_11_FRUIT_TREE": object.flagId = "GOT_ROUTE_11_FRUIT_TREE"; break
      case "ROUTE_26_FRUIT_TREE": object.flagId = "GOT_ROUTE_26_FRUIT_TREE"; break
      case "ROUTE_29_FRUIT_TREE": object.flagId = "GOT_ROUTE_29_FRUIT_TREE"; break
      case "ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE": object.flagId = "GOT_ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE"; break
      case "ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE": object.flagId = "GOT_ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE"; break
      case "ROUTE_31_FRUIT_TREE": object.flagId = "GOT_ROUTE_31_FRUIT_TREE"; break
      case "ROUTE_33_FRUIT_TREE": object.flagId = "GOT_ROUTE_33_FRUIT_TREE"; break
      case "ROUTE_35_SURF_AREA_FRUIT_TREE": object.flagId = "GOT_ROUTE_35_SURF_AREA_FRUIT_TREE"; break
      case "ROUTE_36_WEST_AREA_FRUIT_TREE": object.flagId = "GOT_ROUTE_36_WEST_AREA_FRUIT_TREE"; break
      case "ROUTE_37_LEFT_FRUIT_TREE": object.flagId = "GOT_ROUTE_37_LEFT_FRUIT_TREE"; break
      case "ROUTE_37_MIDDLE_FRUIT_TREE": object.flagId = "GOT_ROUTE_37_MIDDLE_FRUIT_TREE"; break
      case "ROUTE_37_RIGHT_FRUIT_TREE": object.flagId = "GOT_ROUTE_37_RIGHT_FRUIT_TREE"; break
      case "ROUTE_38_FRUIT_TREE": object.flagId = "GOT_ROUTE_38_FRUIT_TREE"; break
      case "ROUTE_39_FRUIT_TREE": object.flagId = "GOT_ROUTE_39_FRUIT_TREE"; break
      case "ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE": object.flagId = "GOT_ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE"; break
      case "ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE": object.flagId = "GOT_ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE"; break
      case "ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE": object.flagId = "GOT_ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE"; break
      case "ROUTE_43_SURF_CUT_AREA_FRUIT_TREE": object.flagId = "GOT_ROUTE_43_SURF_CUT_AREA_FRUIT_TREE"; break
      case "ROUTE_44_FRUIT_TREE": object.flagId = "GOT_ROUTE_44_FRUIT_TREE"; break
      case "ROUTE_45_FRUIT_TREE": object.flagId = "GOT_ROUTE_45_FRUIT_TREE"; break
      case "ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE": object.flagId = "GOT_ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE"; break
      case "ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE": object.flagId = "GOT_ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE"; break
      case "PEWTER_CITY_LEFT_FRUIT_TREE": object.flagId = "GOT_PEWTER_CITY_LEFT_FRUIT_TREE"; break
      case "PEWTER_CITY_RIGHT_FRUIT_TREE": object.flagId = "GOT_PEWTER_CITY_RIGHT_FRUIT_TREE"; break
      case "FUCHSIA_CITY_CUT_AREA_FRUIT_TREE": object.flagId = "GOT_FUCHSIA_CITY_CUT_AREA_FRUIT_TREE"; break
      case "VIOLET_CITY_FRUIT_TREE": object.flagId = "GOT_VIOLET_CITY_FRUIT_TREE"; break
      case "AZALEA_TOWN_FRUIT_TREE": object.flagId = "GOT_AZALEA_TOWN_FRUIT_TREE"; break
      }
    })
  }
}