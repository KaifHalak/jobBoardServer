import { Request, Response, NextFunction } from "express"
import path from "path"
import fs from "fs"

const url = path.join(__dirname, "../", "../", "../", "client", "public", "createJobPostUI", "index")

export async function GetJobPost(req: Request, res: Response, next: NextFunction){
    let countries = ReadJSON()
    res.render(url,{countries})
}

// JSON format:
// {
//   Country1: [cities],
//   Country2: [cities],
//   ....
// }

function ReadJSON(){
    let data = fs.readFileSync(path.join(__dirname,"../", "../", "extras", "formattedWorlCities.json"), "utf8")
    let jsonData = JSON.parse(data)
    return jsonData
}