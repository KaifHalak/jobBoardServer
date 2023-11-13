import { Response, NextFunction } from "express"

import { ServerError } from "@middlewares/globalErrorHandling";

import { interfaceExpress } from "@utils/types/authTypes";

import path from "path"
import db from "@utils/database";

// Function:
// View a more detailed version of a job posting


const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "viewJobPostUI", "index.ejs")

export default async function GETViewJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    try {
        let jobId = req.params.id!
        let jobInfo = await db.GetJob(jobId)
        return res.render(FILE_PATH, {jobInfo})
    } catch (error) {
        console.log("Error viewing a job:", error)
        ServerError(req, res, next)()
    }

}