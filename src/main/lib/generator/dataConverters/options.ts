import { isNotNullish } from "@shared/utils"

export const primaryOptionsValue = (
  defaults: {
    textSpeed: "SLOW" | "MID" | "FAST" | "INST"
    holdToMashEnabled: boolean
    battleSceneEnabled: boolean
    battleStyle: "SHIFT" | "SET"
    sound: "STEREO" | "MONO"
  },
  instantTextEnabled: boolean,
  hasAdditionalOptions: boolean
): number => {
  let result = 0
  
  switch (defaults.textSpeed ?? "MID") {
  case "SLOW": {
    result |= 0b00000101
    break
  }
  case "MID": {
    result |= 0b00000011
    break
  }
  case "FAST": {
    result |= 0b00000001
    break
  }
  case "INST": {
    if (!instantTextEnabled) {
      result |= 0b00000001 // Instant Text is not included in the additional options, use "FAST" instead.
    }
    break
  }
  }
  
  if (defaults.holdToMashEnabled) {
    result |= 0b00001000
  }
  
  if (hasAdditionalOptions === defaults.battleSceneEnabled) { // With additional options, we set the bit when the option is enabled, but vanilla does the opposite
    result |= 0b10000000
  }
  
  if (hasAdditionalOptions === (defaults.battleStyle === "SHIFT")) { // With additional options, we set the bit when the option is set to "SHIFT", but vanilla does the opposite
    result |= 0b01000000
  }
  
  if (defaults.sound === "STEREO") {
    result |= 0b00100000
  }
  
  return result
}

export const secondaryOptionsValue = (defaults: {
  nicknamesEnabled: boolean
  rideMusic: "NONE" | "BIKE_ONLY" | "SURF_ONLY" | "BOTH"
  menuAccountEnabled: boolean
}): number => {
  let result = 0
  
  if (defaults.nicknamesEnabled) {
    result |= 0b00000010
  }
  
  switch (defaults.rideMusic) {
  case "BOTH": {
    result |= 0b00001100
    break
  }
  case "SURF_ONLY": {
    result |= 0b00000100
    break
  }
  case "BIKE_ONLY": {
    result |= 0b00001000
    break
  }
  }
  
  if (defaults.menuAccountEnabled) {
    result |= 0b00000001
  }
  
  return result
}

export const frameTypeValue = (frameNumber: number | undefined) => {
  if (isNotNullish(frameNumber)) {
    return frameNumber - 1
  } else {
    return 0
  }
}

export const printToneValue = (printTone: "LIGHTEST" | "LIGHTER" | "NORMAL" | "DARKER" | "DARKEST"): number => {
  switch (printTone) {
  case "LIGHTEST": return 0x00
  case "LIGHTER": return 0x20
  case "NORMAL": return 0x40
  case "DARKER": return 0x60
  case "DARKEST": return 0x7F
  }
}