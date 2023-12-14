import { Response, NextFunction } from "express"
import path from "path"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import { CustomRequest } from "@utils/interfaces/authTypes";
import db from "@utils/database";
import { logger } from "@utils/logger/dataLogger";
import httpStatusCodes from "@utils/enums/httpStatusCodes";
import { ControllerCatchError } from "@utils/catchError";

// Function
//  Saved Jobs UI and its related operations


const SAVED_JOBS_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "savedJobsUI", "index.ejs")

export async function GETSavedJobsPage(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let allJobs = await db.GetSavedJobs(userId)

        logger.events("GETSavedJobsPage successfully: GETSavedJobsPage", {userId, userIp})

        // allJobs: Information about job posts

        // allSavedJobIds: Either contains information about "saved" job posts or is set to FALSE. In this case, it is FALSE (no saved jobs posts)

        // When deleteJobs is FALSE, the "save" / "unsave" button will appear on the UI instead of the "delete job" button.

        return res.render(SAVED_JOBS_UI_PATH, {allJobs, allSavedJobIds: false, deleteJobs: false})

    } catch (error) {
        let error_ = error as Error
        ControllerCatchError(req, res, next)(error_, `savedJobs/${GETSavedJobsPage.name}()`, "error", {userId, userIp})
    }   

}


export async function POSTSaveJob(req: CustomRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.body.jobId

    try {

        if (!Number(jobId)){
            logger.events("Job id not a number: POSTSaveJob")
            return res.send({error: "Incorrect job id"})
        }

        // Check if job exists
        let job = await db.GetJob(jobId)

        if (!job){
            logger.events("Job does not exist: POSTSaveJob", {userId, userIp, jobId})
            return CustomError(req, res, next)("Job does not exist", httpStatusCodes.BAD_REQUEST)
        }

        // Save job to user's account only if the job exists
        let outcome = (await db.SaveJob(userId, jobId)).changedRows

        if (outcome > 1){
            throw Error("changedRows > 1")
        }

        logger.events("Job saved successfully: POSTSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job saved successfully"})

    } catch (error) {
        let error_ = error as Error
        ControllerCatchError(req, res, next)(error_, `savedJobs/${POSTSaveJob.name}()`, "error", {userId, userIp, jobId})
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
            logger.events("Job does not exist: POSTUnSaveJob", {userId, userIp, jobId})
            return CustomError(req, res, next)("Job does not exist", httpStatusCodes.BAD_REQUEST)
        }

        // Unsave job to user's account only if the job exists

        let outcome = (await db.UnSaveJob(userId, jobId)).changedRows

        if (outcome > 1){
            throw Error("changedRows > 1")
        }

        logger.events("Job unsaved successfully: POSTUnSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job unsaved successfully"})

    } catch (error) {
        let error_ = error as Error
        ControllerCatchError(req, res, next)(error_, `savedJobs/${POSTUnSaveJob.name}()`, "error", {userId, userIp, jobId})
    }   

}