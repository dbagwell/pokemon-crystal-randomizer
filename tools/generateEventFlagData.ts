import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const eventFlagsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "constants/event_flags.asm"), "utf-8")

let index = 0

const eventFlags: any = {}

;[...eventFlagsFileText.matchAll(/\n\s*(const\s*EVENT_(\S*)|const_skip|(const_next)\s*(\S*))/g)].forEach((match) => {
  if (match[1] === "const_skip") {
    index++
  } else if (match[3] === "const_next") {
    index = parseInt(match[4])
  } else {
    const eventFlag = {
      id: match[2],
      numericId: index,
    }
    
    index++
    
    eventFlags[eventFlag.id] = eventFlag
  }
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "eventFlags.json"), JSON.stringify(eventFlags, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "eventFlagIds.json"), JSON.stringify(Object.keys(eventFlags), null, 2), "utf-8")