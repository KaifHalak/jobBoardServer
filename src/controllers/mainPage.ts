import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { interfaceExpress } from "@utils/types/authTypes";
import { JobTypes, Locations  } from "@utils/enums/jobPostDetails";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";


const FILE_PATH = path.join(__dirname, "../", "../", "../",  "client", "public", "mainUI", "index")
const JOB_TYPES = Object.values(JobTypes)
const COUNTRIES = Locations


interface filters{
    // [key: string]: string | undefined;
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string,
    offset?: string
}



export async function GETMainPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let filters: filters = {}
    try {
        filters = req.query

        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)

        logger.Events("GETMainPage successfull", {userId, userIp, filters})
        return res.render(FILE_PATH, {allJobs, allSavedJobIds, jobTypes: JOB_TYPES, countries: COUNTRIES, filters})

    } catch (error) {
        let error_ = error as Error        
        error_.message = "Error getting main page: GETMainPage"
        logger.Fatal(error_, {userId, userIp, filters}) 
        ServerError(req, res, next)()
    }
}


export async function POSTGetMoreJobs(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let filters: filters = {}

    try {
        
        filters = req.query
        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)
        
        logger.Events("More jobs for the main page sent to user successfully: POSTGetMoreJobs",{userId, userIp, filters})

        return res.send({status: {allJobs, allSavedJobIds}})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error requesting for more jobs: POSTGetMoreJobs"
        logger.Error(error_, {userId, userIp, filters})

        ServerError(req, res, next)()
    }
}


// Helper Functions

async function RetrieveJobData(filters: filters, userId: string){
     // Remove empty filters
     Object.keys(filters).forEach((key) => {
        let filterKey = key as keyof filters
        if (!filters[filterKey]){
            delete filters[filterKey]
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

