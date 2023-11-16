import { Response, NextFunction } from "express"

import { ServerError } from "@middlewares/globalErrorHandling";

import { interfaceExpress } from "@utils/types/authTypes";
import { JobTypes, Locations  } from "@utils/enums/jobPostDetails";

import db from "@utils/database";
import path from "path"

const FILE_PATH = path.join(__dirname, "../", "../", "../",  "client", "public", "mainUI", "index")
const JOB_TYPES = Object.values(JobTypes)
const COUNTRIES = Locations


interface filters{
    [key: string]: string | undefined;
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string,
    offset?: string
}

export async function MainPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let filters = req.query as filters
        let userId = req.userId!

        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)
        res.render(FILE_PATH, {allJobs, allSavedJobIds, jobTypes: JOB_TYPES, countries: COUNTRIES, filters})

    } catch (error) {
        console.log("Error sending user the main page:", error)
        ServerError(req, res, next)()
    }
}


export async function POSTMoreJobs(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        
        let filters = req.query as filters
        let userId = req.userId!
        
        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)

        return res.send({status: {allJobs, allSavedJobIds}})

    } catch (error) {
        console.log("error getting more jobs:", error)
        ServerError(req, res, next)()
    }
}



async function RetrieveJobData(filters: filters, userId: string){
     // Remove empty filters
     Object.keys(filters).forEach((key) => {
        if (!filters[key]){
            delete filters[key]
        }
    })

    let allJobs = await db.GetAllJobs(filters)

    // To allow users to see which jobs they have already saved on the main page (if logged in)
    let allSavedJobIds = []
    
    // If the user is logged in
    if (userId){
        allSavedJobIds = await db.GetAllSavedJobIds(userId)
    }

    return {allJobs, allSavedJobIds}

}

