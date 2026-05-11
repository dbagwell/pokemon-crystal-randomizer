
import fs from "fs"
import yaml from "yaml"

export const getYAML = (searchPaths: string[], error?: unknown): any => {
  if (searchPaths.length < 1) {
    throw error
  }
  
  try {
    return yaml.parse(fs.readFileSync(searchPaths[0], "utf8"))
  } catch (error) {
    return getYAML(searchPaths.slice(1), error)
  }
}