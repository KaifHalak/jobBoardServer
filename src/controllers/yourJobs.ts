import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { interfaceExpress } from "@utils/types/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "yourJobsUI", "index.ejs")

export async function GETYourJobsPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let allJobs = await db.GetCreatedJobs(userId)

        logger.Events("GETYourJobsPage successfull", {userId, userIp})

        return res.render(FILE_PATH, {allJobs, allSavedJobIds: false, deleteJobs: true})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error getting saved jobs page: GETYourJobsPage"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}


export async function POSTDeleteJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

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

export async function POSTGetMoreYourJobs(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let offset: any

    try {
        
        offset = Number(req.query.offset)
        let moreJobs = await db.GetCreatedJobs(userId, offset)
        logger.Events("More jobs for the created jobs page sent to user successfully: POSTGetMoreYourJobs",{userId, userIp, offset})
        return res.send({status: {moreJobs}})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error requesting for more jobs: POSTGetMoreJobs"
        logger.Error(error_, {userId, userIp, offset})

        ServerError(req, res, next)()
    }
}

