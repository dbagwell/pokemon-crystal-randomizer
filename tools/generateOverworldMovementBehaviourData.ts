import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const mapObjectInfoFileText = fs.readFileSync(path.resolve(pokecrystalPath, "constants/map_object_constants.asm"), "utf-8")
const sectionText = mapObjectInfoFileText.match(/const_def([\s\S]*?)DEF NUM_SPRITEMOVEDATA EQU/)![1]

let index = 0
const behaviours: any = {}

;[...sectionText.matchAll(/const\s*SPRITEMOVEDATA_(\S*)/g)].forEach((match) => {
  const behaviour = {
    id: match[1],
    numericId: index,
  }
  
  if (match[1].length > 2 && !match[1].includes("INDEXED")) {
    behaviours[behaviour.id] = behaviour
  }
  
  index++
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "overworldMovementBehaviours.json"), JSON.stringify(behaviours, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "overworldMovementBehaviourIds.json"), JSON.stringify(Object.keys(behaviours), null, 2), "utf-8")