import { app } from "electron"
import path from "path"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")