import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";

import { JobDetails } from "@utils/types/jobsTypes";
import { interfaceExpress } from "@utils/types/authTypes";

import path from "path"
import fs from "fs"
import db from "@utils/database";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "viewJobPostUI", "index.ejs")

export default async function GETViewJobs(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    try {
        let jobId = req.params.id!
        let jobInfo = await db.GetJob(jobId)
        console.log(jobInfo)
        return res.render(FILE_PATH, {jobInfo})
    } catch (error) {
        console.log("Error viewing a job:", error)
        ServerError(req, res, next)()
    }

}