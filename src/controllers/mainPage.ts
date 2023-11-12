import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";

import { interfaceExpress } from "@utils/types/authTypes";

import db from "@utils/database";
import path from "path"
import fs from "fs"

const FILE_PATH = path.join(__dirname, "../", "../", "../",  "client", "public", "mainUI", "index")
const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"]
const COUNTRIES = ReadJSON()


interface filters{
    [key: string]: string | undefined;
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string
}

export default async function MainPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let filters = req.query as filters

        Object.keys(filters).forEach((key) => {
            if (!filters[key]){
                delete filters[key]
            }
        })

        let userId = req.userId!
        let allJobs = await db.GetAllJobs(filters)
        let allSavedJobIds = []
        
        if (userId){
            allSavedJobIds = await db.GetAllSavedJobIds(userId)
        }
        res.render(FILE_PATH, {allJobs, allSavedJobIds, jobTypes: JOB_TYPES, countries: COUNTRIES, filters})

    } catch (error) {
        console.log("Error sending user the main page:", error)
        ServerError(req, res, next)()
    }
}


function ReadJSON(){

    // JSON format:
    // {
    //   Country1: [cities],
    //   Country2: [cities],
    //   ....
    // }


    let data = fs.readFileSync(path.join(__dirname,"../", "../", "extras", "formattedWorlCities.json"), "utf8")
    let jsonData = JSON.parse(data)
    return jsonData
}