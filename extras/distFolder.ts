import fs from "fs"
import path from "path"

let distFolderPath = path.join(__dirname,"../","dist")

// Delete "dist" folder if it exists
if (fs.existsSync(distFolderPath)){
    fs.rmdirSync(distFolderPath, { recursive: true })
}
