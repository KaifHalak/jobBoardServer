import { Response, NextFunction } from "express"
import path from "path"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import { CustomRequest } from "@utils/interfaces/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";
import httpStatusCodes from "@utils/enums/httpStatusCodes";

// Function
//  Saved Jobs UI and its related operations


const SAVED_JOBS_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "savedJobsUI", "index.ejs")

export async function GETSavedJobsPage(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let allJobs = await db.GetSavedJobs(userId)

        logger.Events("GETSavedJobsPage successfully: GETSavedJobsPage", {userId, userIp})

        // allJobs: Information about job posts

        // allSavedJobIds: Either contains information about "saved" job posts or is set to FALSE. In this case, it is FALSE (no saved jobs posts)

        // When deleteJobs is FALSE, the "save" / "unsave" button will appear on the UI instead of the "delete job" button.

        return res.render(SAVED_JOBS_UI_PATH, {allJobs, allSavedJobIds: false, deleteJobs: false})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error getting saved jobs page: GETSavedJobsPage"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}


export async function POSTSaveJob(req: CustomRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.body.jobId

    try {

        if (!Number(jobId)){
            logger.Events("Job id not a number: POSTSaveJob")
            return res.send({error: "Incorrect job id"})
        }

        // Check if job exists
        let job = await db.GetJob(jobId)

        if (!job){
            logger.Events("Job does not exist: POSTSaveJob", {userId, userIp, jobId})
            return CustomError(req, res, next)("Job does not exist", httpStatusCodes.BAD_REQUEST)
        }

        // Save job to user's account only if the job exists
        await db.SaveJob(userId, jobId)

        logger.Events("Job saved successfully: POSTSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job saved successfully"})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error saving job: POSTSaveJob"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}

export async function POSTUnSaveJob(req: CustomRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.body.jobId

    try {

        // Check if job exists
        let job = await db.GetJob(jobId)

        if (!job){
            logger.Events("Job does not exist: POSTUnSaveJob", {userId, userIp, jobId})
            return CustomError(req, res, next)("Job does not exist", httpStatusCodes.BAD_REQUEST)
        }

        // Unsave job to user's account only if the job exists

        await db.UnSaveJob(userId, jobId)

        logger.Events("Job unsaved successfully: POSTUnSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job unsaved successfully"})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error unsaving job: POSTUnSaveJob"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}