import { Response, NextFunction } from "express"
import path from "path"

import { ServerError } from "@middlewares/globalErrorHandling";
import { interfaceExpress } from "@utils/types/authTypes";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";



// Function:
// View a more detailed version of a job posting


const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "viewJobPostUI", "index.ejs")

export default async function GETViewJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!
    let jobId = req.params.id!
    try {
        let jobInfo = await db.GetJob(jobId)

        logger.Events("GETViewJob successfull", {userId, userIp, jobId})

        return res.render(FILE_PATH, {jobInfo})
    } catch (error) {
        let error_ = error as Error
        error_.message = "Error GETViewJob"
        logger.Events(error_, {userId, userIp, jobId})
        ServerError(req, res, next)()
    }

}