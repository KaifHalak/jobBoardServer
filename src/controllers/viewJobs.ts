import { Response, NextFunction } from "express"
import path from "path"

import { CustomError } from "@middlewares/globalErrorHandling";
import httpStatusCodes from "@utils/enums/httpStatusCodes";
import { ServerError } from "@middlewares/globalErrorHandling";
import { CustomRequest } from "@utils/interfaces/authTypes";
import db from "@utils/database";
import { logger } from "@utils/logger/dataLogger";
import { ControllerCatchError } from "@utils/catchError";

// Function:
// View a more detailed version of a job posting


const VIEW_JOB_POST_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "viewJobPostUI", "index.ejs")
const PAGE_NOT_FOUND_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "pageNotFoundUI", "index.html")

export default async function GETViewJob(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.params.id!

    try {

        if (!Number(jobId)){
            logger.events("Job id not a number: GETViewJob", {userId, userIp, jobId})
            return CustomError(req, res, next)("Incorrect job id", httpStatusCodes.BAD_REQUEST)
        }
        
        await db.IncrementViewCounter(jobId)
        let jobInfo = await db.GetJob(jobId)

        // Job doesnt exist
        if (!jobInfo){
            logger.events("Job does not exist: GETViewJob", {userId, userIp, jobId})
            return res.status(404).sendFile(PAGE_NOT_FOUND_UI_PATH)
        }

        logger.events("GETViewJob successfull", {userId, userIp, jobId})

        return res.render(VIEW_JOB_POST_UI_PATH, {jobInfo})
    } catch (error) {
        let error_ = error as Error
        return ControllerCatchError(req, res, next)(error_, `viewJobs/${GETViewJob.name}()`, "error", {userId, userIp, jobId})
    }

}