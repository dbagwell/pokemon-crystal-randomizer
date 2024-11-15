import fs from "fs"
import path from "path"

const pokecrystalPath: string = process.env.pokecrystalPath!
const martsFileText = fs.readFileSync(path.resolve(pokecrystalPath, "data/items/marts.asm"), "utf-8")

const marts: any = {}

;[...martsFileText.matchAll(/(?<!^)Mart(\S+):\n.*\n([\s\S]*?)\n.*-1/g)].forEach((match) => {
  let martId = match[1].match(/[A-Z][a-z]*|[0-9]F|[0-9]/g)!.map((string) => {
    return string.toUpperCase()
  }).join("_")
  
  if (martId === "CHERRYGROVE") {
    martId = "CHERRYGROVE_1"
  } else if (martId === "CHERRYGROVE_DEX") {
    martId = "CHERRYGROVE_2"
  }
  
  marts[martId] = {
    id: martId,
    groupId: martId.includes("CHERRYGROVE")
      ? "CHERRYGROVE"
      : martId.includes("GOLDENROD_5F")
        ? "GOLDENROD_5F"
        : martId,
    items: match[2].split("\n").map((line) => {
      const itemId = line.match(/db\s*(\S*)/)![1]
      switch (itemId) {
      case "TM_THUNDERPUNCH": {
        return "TM41"
      }
      case "TM_FIRE_PUNCH": {
        return "TM48"
      }
      case "TM_ICE_PUNCH": {
        return "TM33"
      }
      case "TM_HEADBUTT": {
        return "TM02"
      }
      case "TM_ROCK_SMASH": {
        return "TM08"
      }
      case "TM_HIDDEN_POWER": {
        return "TM10"
      }
      case "TM_SUNNY_DAY": {
        return "TM11"
      }
      case "TM_PROTECT": {
        return "TM17"
      }
      case "TM_RAIN_DANCE": {
        return "TM18"
      }
      case "TM_SANDSTORM": {
        return "TM37"
      }
      default: {
        return itemId
      }
      }
    }),
  }
})

marts.GOLDENROD_5F_5 = {
  id: "GOLDENROD_5F_5",
  groupId: "GOLDENROD_5F",
  items: [],
}

marts.GOLDENROD_5F_6 = {
  id: "GOLDENROD_5F_6",
  groupId: "GOLDENROD_5F",
  items: [],
}

marts.GOLDENROD_5F_7 = {
  id: "GOLDENROD_5F_7",
  groupId: "GOLDENROD_5F",
  items: [],
}

marts.GOLDENROD_5F_8 = {
  id: "GOLDENROD_5F_8",
  groupId: "GOLDENROD_5F",
  items: [],
}

const martGroupIds = Object.keys(Object.values(marts).reduce((result: any, mart: any) => {
  result[mart.groupId] = 0
  return result as any
}, {}) as any)

const outputPath: string = process.env.outputPath!

fs.writeFileSync(path.resolve(outputPath, "marts.json"), JSON.stringify(marts, null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "martIds.json"), JSON.stringify(Object.keys(marts), null, 2), "utf-8")
fs.writeFileSync(path.resolve(outputPath, "martGroupIds.json"), JSON.stringify(martGroupIds, null, 2), "utf-8")