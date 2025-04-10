import { playerSpriteMap } from "@shared/gameData/playerSprite"
import { playerSpriteIds } from "@shared/types/gameDataIds/playerSprites"
import { createIntegerInputViewModel, createSimpleSelectorOption, createSimpleToggleViewModel, createSingleSelectorViewModel, createTextInputViewModel } from "@shared/types/viewModels"

export const defaultPlayerOptionsViewModel = () => {
  return {
    viewModels: [
      playerGenderOption(),
      playerNameOption(),
      textSpeedOption(),
      holdToMashOption(),
      battleSceneOption(),
      battleStyleOption(),
      nicknamesOption(),
      soundOption(),
      rideMusicOption(),
      menuAccountOption(),
      printerToneOption(),
      frameTypeOption(),
    ],
  }
}

const playerGenderOption = () => {
  return createSingleSelectorViewModel({
    id: "PLAYER_GENDER" as const,
    name: "Player Gender",
    description: "Sets the gender hightlighted by default when starting a new game. "
      + "Also used as the player's gender if the 'Skip Gender Selection' setting is enabled.",
    selectedOptionId: "GIRL",
    options: playerSpriteIds.map((spriteId) => {
      return createSimpleSelectorOption({
        id: spriteId,
        name: playerSpriteMap[spriteId].label,
      })
    }),
  })
}

const playerNameOption = () => {
  return createTextInputViewModel({
    id: "PLAYER_NAME" as const,
    name: "Player Name",
    description: "Sets the default player name used if no name is entered when starting a new game. "
      + "Also used as the player's name if the 'Skip Name Selection' setting is enabled.\n"
      + "Unsupported characters will be replaced with spaces.",
    maxCharacters: 7,
    isRequired: true as const,
    value: "KRIS",
  })
}

const textSpeedOption = () => {
  return createSingleSelectorViewModel({
    id: "TEXT_SPEED" as const,
    name: "Text Speed",
    description: "Sets the default value of the 'Text Speed' option.",
    selectedOptionId: "MID",
    options: [
      createSimpleSelectorOption({
        id: "SLOW" as const,
        name: "SLOW",
        description: "The slowest dialog text animation speed.",
      }),
      createSimpleSelectorOption({
        id: "MID" as const,
        name: "MID",
        description: "Medium text dialog animation speed.",
      }),
      createSimpleSelectorOption({
        id: "FAST" as const,
        name: "FAST",
        description: "The fastest dialog text animation speed.",
      }),
      createSimpleSelectorOption({
        id: "INST" as const,
        name: "INST",
        description: "All dialog text appears on screen instantly without any animation.\n"
          + "Requires 'Instant Text' to be included in the additional options, otherwise 'FAST' speed is used.",
      }),
    ],
  })
}

const holdToMashOption = () => {
  return createSimpleToggleViewModel({
    id: "HOLD_TO_MASH" as const,
    name: "Hold To Mash",
    description: "Sets the default value of the 'Hold To Mash' option if it is included in the additional options."
      + "If enabled, holding the A or B buttons will automatically advance the text during most dialog.",
    isOn: false,
  })
}

const battleSceneOption = () => {
  return createSimpleToggleViewModel({
    id: "BATTLE_SCENE" as const,
    name: "Battle Scene",
    description: "Sets the default value of the 'Battle Scene' option.\n"
      + "If disabled, no animations will play showing the moves each Pokémon is using during battle.",
    isOn: true,
  })
}

const battleStyleOption = () => {
  return createSingleSelectorViewModel({
    id: "BATTLE_STYLE" as const,
    name: "Battle Style",
    description: "Sets the default value of the 'Battle Style' option.",
    selectedOptionId: "SHIFT",
    options: [
      createSimpleSelectorOption({
        id: "SHIFT" as const,
        name: "SHIFT",
        description: "Allows switching Pokémon (without taking a turn) after an opponent Pokémon has been defeated during trainer battles.",
      }),
      createSimpleSelectorOption({
        id: "SET" as const,
        name: "SET",
        description: "No option to switch Pokémon (without taking a turn) is given after defeating an opponent Pokémon durring trainer battles.",
      }),
    ] as const,
  })
}

const nicknamesOption = () => {
  return createSimpleToggleViewModel({
    id: "NICKNAMES" as const,
    name: "Nicknames",
    description: "Sets the default value of the 'Nicknames' option if it is included in the additional options.\n"
      + "If disabled, no prompt will be given to nickname Pokémon after they have been caught or received.",
    isOn: true,
  })
}

const soundOption = () => {
  return createSingleSelectorViewModel({
    id: "SOUND" as const,
    name: "Sound",
    description: "Sets the default value of the 'Sound' option.",
    selectedOptionId: "STEREO",
    options: [
      createSimpleSelectorOption({
        id: "STEREO" as const,
        name: "STEREO",
      }),
      createSimpleSelectorOption({
        id: "MONO" as const,
        name: "MONO",
      }),
    ] as const,
  })
}

const rideMusicOption = () => {
  return createSingleSelectorViewModel({
    id: "RIDE_MUSIC" as const,
    name: "Ride Music",
    description: "Sets the default value of the 'Ride Music' option if it is included in the additional options.",
    selectedOptionId: "BOTH",
    options: [
      createSimpleSelectorOption({
        id: "NONE" as const,
        name: "NONE",
        description: "The music will not change after getting on the bike or starting to surf.",
      }),
      createSimpleSelectorOption({
        id: "BIKE_ONLY" as const,
        name: "BIKE",
        description: "The music will not change after starting to surf, but will change to the 'Bike Music' after getting on the bike.",
      }),
      createSimpleSelectorOption({
        id: "SURF_ONLY" as const,
        name: "SURF",
        description: "The music will not change after getting on the bike, but will change to the 'Surf Music' after starting to surf.",
      }),
      createSimpleSelectorOption({
        id: "BOTH" as const,
        name: "BOTH",
        description: "The music will change to the 'Bike' or 'Surf' music when getting on the bike or starting to surf, respectively.",
      }),
    ] as const,
  })
}

const menuAccountOption = () => {
  return createSimpleToggleViewModel({
    id: "MENU_ACCOUNT" as const,
    name: "Menu Account",
    description: "Sets the default value of the 'Menu Account' option.\n"
      + "If enabled, short descriptions of menu items will be shown while a menu item is highlighted.",
    isOn: true,
  })
}

const printerToneOption = () => {
  return createSingleSelectorViewModel({
    id: "PRINT_TONE" as const,
    name: "Print Tone",
    description: "Sets the default value of the 'Print Tone' option.",
    selectedOptionId: "NORMAL",
    options: [
      createSimpleSelectorOption({
        id: "LIGHTEST" as const,
        name: "LIGHTEST",
      }),
      createSimpleSelectorOption({
        id: "LIGHTER" as const,
        name: "LIGHTER",
      }),
      createSimpleSelectorOption({
        id: "NORMAL" as const,
        name: "NORMAL",
      }),
      createSimpleSelectorOption({
        id: "DARKER" as const,
        name: "DARKEST",
      }),
      createSimpleSelectorOption({
        id: "DARKEST" as const,
        name: "DARKEST",
      }),
    ] as const,
  })
}

const frameTypeOption = () => {
  return createIntegerInputViewModel({
    id: "FRAME_TYPE" as const,
    name: "Frame Type",
    description: "Sets the default value of the 'Frame Type' option.",
    min: 1,
    max: 8,
    isRequired: true,
    value: 1,
  })
}