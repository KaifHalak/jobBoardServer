import { Response, NextFunction } from "express"
import path from "path"
import fs from "fs"

import { ServerError } from "@middlewares/globalErrorHandling";
import { CustomRequest } from "@utils/interfaces/authTypes";
import { JobTypes, Locations  } from "@utils/enums/jobPostDetails";
import db from "@utils/database";
import { logger } from "@utils/logger/dataLogger";
import { VerifyToken } from "@utils/security/jwtToken";
import { ControllerCatchError } from "@utils/catchError";

// Function:
// MAIN page UI and its related operations


const MAIN_PAGE_UI_PATH = path.join(__dirname, "../", "../", "../",  "jobBoardClient", "public", "mainUI", "index")
const IMAGE_FILE_PATH = path.join(__dirname, "../", "../","jobBoardUserImages", "final")


interface filters{
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string,
    offset?: string
}



export async function GETMainPage(req: CustomRequest, res: Response, next: NextFunction){
    
    let token = req.cookies["sessionToken"]
    let userId = VerifyToken(token)?.userId
    let userIp = req.ip
    let filters: filters = {}

    try {
        filters = req.query

        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)

        let fullProfilePicUrlPath: string , username: string

        // If user is logged in
        if (userId){

            let { profilePicUrlPath } = await db.GetUserProfilePicURLPath(userId)
            
            // If user doesnt have a profile pic set, set it to the default on

            if (!profilePicUrlPath){
                fullProfilePicUrlPath = path.join(IMAGE_FILE_PATH, "default.png")
            }
            else {
                fullProfilePicUrlPath = path.join(IMAGE_FILE_PATH, profilePicUrlPath)
            }
            username = await db.GetUsername(userId)
        } 
        else {
            // Set the profile pic to the default one if the user is not logged in
            fullProfilePicUrlPath = path.join(IMAGE_FILE_PATH, "default.png")
            username = "Login"
        }

        // convert image to base64 url
        const contents = fs.readFileSync(fullProfilePicUrlPath)
        const b64 = contents.toString('base64')
        const type = "png"

        logger.events("GETMainPage successfull", {userId, userIp})


        // allJobs: Information about job posts

        // allSavedJobIds: Either contains information about "saved" job posts or is set to FALSE. In this case, its set to FALSE

        // jobTypes: Used for filtering (INTERNSHIP, CONTRACT, etc.)

        // countries: Used for filtering (Pakistan, Turkey, etc.)

        // filters: Contains the active filters. Used to display the selected filters when the page reloads.

        // profilePic: base64 encoded profile pic of the user

        // username: user's username

        return res.render(MAIN_PAGE_UI_PATH, {allJobs, allSavedJobIds, jobTypes: Object.values(JobTypes), countries: Locations, filters, profilePic: `data:${type};base64,${b64}`, username})

    } catch (error) {
        let error_ = error as Error        
        ControllerCatchError(req, res, next)(error_, `mainPage/${GETMainPage.name}()`, "error", {userId, userIp, filters})
    }
}


export async function POSTGetMoreJobs(req: CustomRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let filters: filters = {}

    try {

        // Get next set of jobs (by default, only 9 jobs will be shown)

        filters = req.query
        let {allJobs, allSavedJobIds} = await RetrieveJobData(filters, userId)
        
        logger.events("More jobs for the main page sent to user successfully: POSTGetMoreJobs",{userId, userIp, filters})

        return res.send({status: {allJobs, allSavedJobIds}})

    } catch (error) {
        let error_ = error as Error
        ControllerCatchError(req, res, next)(error_, `mainPage/${POSTGetMoreJobs.name}()`, "error", {userId, userIp, filters})

        ServerError(req, res, next)()
    }
}


// Helper Functions

async function RetrieveJobData(filters: filters, userId: string | undefined){
     // Remove empty filters
     Object.keys(filters).forEach((key) => {
        let filterKey = key as keyof filters
        if (!filters[filterKey]){
            delete filters[filterKey]
        }
    })


    let allJobs = await db.GetAllJobs(filters)

    // To allow users to see which jobs they have already saved, on the main page (if logged in)
    let allSavedJobIds = []
    
    // If the user is logged in
    if (userId){
        allSavedJobIds = await db.GetAllSavedJobIds(userId)
    }

    return {allJobs, allSavedJobIds}

}

