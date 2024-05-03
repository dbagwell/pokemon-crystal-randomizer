import type { AdditionalOption } from "@shared/types/gameData/additionalOption"
import type { AdditionalOptionId } from "@shared/types/gameDataIds/additionalOptions"
    
export const additionalOptionsMap: IdMap<AdditionalOptionId, AdditionalOption> = {
  INSTANT_TEXT: {
    id: "INSTANT_TEXT",
    name: "Instant Text",
    description: "A new option for the text speed setting that makes all the text in a single text box appear immediately.",
  },
  HOLD_TO_MASH: {
    id: "HOLD_TO_MASH",
    name: "Hold To Mash",
    description: "A toggle that allows holding down the A or B buttons to mash through text when enabled.",
  },
  NICKNAMES: {
    id: "NICKNAMES",
    name: "Nicknames",
    description: "A toggle that controls whether the game prompts to nickname newly captured/recieved Pokémon.",
  },
  RIDE_MUSIC: {
    id: "RIDE_MUSIC",
    name: "Ride Music",
    description: "An option that controls whether the surf and/or bike music will play.",
  },
}