import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { CustomRequest } from "@utils/interfaces/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";

const USERS_CREATED_JOB_POSTS_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "yourJobsUI", "index.ejs")

// Function:
// View user's created job posts and its related operations

export async function GETUsersJobPostsPage(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let allJobs = await db.GetCreatedJobs(userId)

        logger.Events("GETYourJobsPage successfull", {userId, userIp})

        // allJobs: Information about job posts

        // allSavedJobIds: Either contains information about "saved" job posts or is set to FALSE. In this case, it is FALSE (no saved jobs posts). In this case, its FALSE (no saved job posts)

        // When deleteJobs is TRUE, the "delete job" button will appear on the UI instead of the "save" / "unsave" button.


        return res.render(USERS_CREATED_JOB_POSTS_UI_PATH, {allJobs, allSavedJobIds: false, deleteJobs: true})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error getting saved jobs page: GETYourJobsPage"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}


export async function POSTDeleteJob(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {

        let { jobId } = req.body

        let result = await db.DeleteJob(userId,jobId)

        if (result){
            res.send({status:"Job deleted successfully"})
            logger.Events("Job deleted successfully: POSTDeleteJob", {userId, userIp})
        }


    } catch (error) {
        let error_ = error as Error
        error_.message = "Error deleting job: POSTDeleteJob"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}

export async function POSTGetMoreUsersJobs(req: CustomRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let offset: Number = 0

    try {
        
        // Get next set of jobs (by default, only 9 jobs will be shown)

        offset = Number(req.query.offset)
        let moreJobs = await db.GetCreatedJobs(userId, offset)
        logger.Events("More jobs for the created jobs page sent to user successfully: POSTGetMoreYourJobs",{userId, userIp, offset})
        return res.send({status: {moreJobs}})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error requesting for more jobs: POSTGetMoreJobs"
        logger.Error(error_, {userId, userIp, offset: offset.toString()})

        ServerError(req, res, next)()
    }
}

