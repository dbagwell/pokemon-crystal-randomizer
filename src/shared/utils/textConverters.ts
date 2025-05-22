const characterMapFrom = (characters: string, startingValue: number) => {
  return characters.split("").reduce((map, character, index) => {
    map[character] = startingValue + index
    return map
  }, {} as Record<string, number>)
}

const characterMap: Record<string, number> = {
  "<POKé>": 0x54,
  "…": 0x75,
  " ": 0x7F,
  ...characterMapFrom("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 0x80),
  ...characterMapFrom("():;[]", 0x9A),
  ...characterMapFrom("abcdefghijklmnopqrstuvwxyz", 0xA0),
  "<'d>": 0xD0,
  "<'l>": 0xD1,
  "<'m>": 0xD2,
  "<'r>": 0xD3,
  "<'s>": 0xD4,
  "<'t>": 0xD5,
  "<'v>": 0xD6,
  "'": 0xE0,
  "<PK>": 0xE1,
  "<MN>": 0xE2,
  "-": 0xE3,
  ...characterMapFrom("?!.&", 0xE6),
  "×": 0xF1,
  "/": 0xF3,
  ",": 0xF4,
  ...characterMapFrom("0123456789", 0xF6),
}

const terminatorCharacterMap = {
  "@": 0x50, // Marks the end of a string
}

const controlCharacterMap = {
  "\0": 0x00, // Starts a text script and starts a paragraph
  "\r": 0x51, // Starts a new paragraph in the same text script
  "\n": 0x4F, // Starts a new line in the same paragraph
  "\t": 0x55, // Continues a line in the same paragraph
  "\f": 0x57, // Ends a text script
}

const bytesFromString = (string: string, characterMap: Record<string, number>) => {
  return string
    .replaceAll("<POKé>", "POKé").replaceAll("POKé", "<POKé>") // Allow transforming "POKé" into the token
    .replaceAll("<", "\\<").replaceAll(">", ">\\") // Insert separators to be able to preserve the tokens
    .split("\\").flatMap((substring) => {
      if (substring.startsWith("<") && substring.endsWith(">")) {
        return characterMap[substring] ?? characterMap["?"]
      } else {
        return substring.split("").map((character) => {
          return characterMap[character] ?? characterMap["?"]
        })
      }
    })
}

export const bytesFromTextData = (textData: string) => {
  return bytesFromString(textData, {
    ...characterMap,
    ...terminatorCharacterMap,
  })
}

export const bytesFromTextScript = (script: string) => {
  return bytesFromString(script, {
    ...characterMap,
    ...terminatorCharacterMap,
    ...controlCharacterMap,
  })
}

export const inGameStringLength = (string: string) => {
  return bytesFromString(string, characterMap).reduce((result, value) => {
    if (value === 0x54) {
      return result + 4
    } else {
      return result + 1
    }
  }, 0)
}