import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { interfaceExpress } from "@utils/types/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "savedJobsUI", "index.ejs")

export async function GETSavedJobsPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let allJobs = await db.GetSavedJobs(userId)

        logger.Events("GETSavedJobsPage successfully: GETSavedJobsPage", {userId, userIp})

        return res.render(FILE_PATH, {allJobs, allSavedJobIds: false, deleteJobs: false})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error getting saved jobs page: GETSavedJobsPage"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }   

}


export async function POSTSaveJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
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
            return res.send({error: "Job does not exist"})
        }

        await db.SaveJob(userId, jobId)

        logger.Events("Job saved successfully: POSTSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job saved successfully"})

    } catch (error) {
        
        if (error instanceof Error){
            error.message = "Error saving job: POSTSaveJob"
            logger.Error(error, {userId, userIp, jobId})
        }

        ServerError(req, res, next)()
    }   

}

export async function POSTUnSaveJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.body.jobId

    try {

        // Check if job exists
        let job = await db.GetJob(jobId)

        if (!job){
            logger.Events("Job does not exist: POSTUnSaveJob", {userId, userIp, jobId})
            return res.send({error: "Job does not exist"})
        }

        await db.UnSaveJob(userId, jobId)

        logger.Events("Job unsaved successfully: POSTUnSaveJob", {userId, userIp, jobId})

        return res.send({status:"Job unsaved successfully"})

    } catch (error) {
        
        if (error instanceof Error){
            error.message = "Error unsaving job: POSTUnSaveJob"
            logger.Error(error, {userId, userIp, jobId})
        }

        ServerError(req, res, next)()
    }   

}