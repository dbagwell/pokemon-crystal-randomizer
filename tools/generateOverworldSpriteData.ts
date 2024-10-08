import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const spritesFileText = fs.readFileSync(path.resolve(pokecrystalPath, "constants/sprite_constants.asm"), "utf-8")

let index = 0
const sprites: any = {}

;[...spritesFileText.matchAll(/\n\s*(const\s*SPRITE_(\S*)|(const_next)\s*\$(\S*))/g)].forEach((match) => {
  if (match[3] === "const_next") {
    index = parseInt(match[4], 16)
  } else {
    const sprite = {
      id: match[2],
      numericId: index,
    }
  
    sprites[sprite.id] = sprite
  
    index++
  }
})

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "sprites.json"), JSON.stringify(sprites, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "spriteIds.json"), JSON.stringify(Object.keys(sprites), null, 2), "utf-8")