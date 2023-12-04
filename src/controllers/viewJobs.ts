import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { interfaceExpress } from "@utils/types/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";



// Function:
// View a more detailed version of a job posting


const FILE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "viewJobPostUI", "index.ejs")

export default async function GETViewJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.params.id!

    try {

        if (!Number(jobId)){
            logger.Events("Job id not a number: GETViewJob", {userId, userIp, jobId})
            return res.send({error:"Incorrect job id"})
        }
        
        await db.IncrementViewCounter(jobId)
        let jobInfo = await db.GetJob(jobId)

        // Job doesnt exist
        if (!jobInfo){
            logger.Events("Job does not exist: GETViewJob", {userId, userIp, jobId})
            return res.send({error: "Job does not exist"})
        }

        logger.Events("GETViewJob successfull", {userId, userIp, jobId})

        return res.render(FILE_PATH, {jobInfo})
    } catch (error) {
        let error_ = error as Error
        error_.message = "Error GETViewJob"
        logger.Error(error_, {userId, userIp, jobId})
        ServerError(req, res, next)()
    }

}