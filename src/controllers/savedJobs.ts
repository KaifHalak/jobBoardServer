import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";

import { JobDetails } from "@utils/types/jobsTypes";
import { interfaceExpress } from "@utils/types/authTypes";

import path from "path"
import fs from "fs"
import db from "@utils/database";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "savedJobsUI", "index.ejs")

export async function GETSavedJobsPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
        let allJobs = await db.GetSavedJobs(userId)
        return res.render(FILE_PATH, {allJobs})
    } catch (error) {
        console.log("Error getting saved jobs:", error)
        ServerError(req, res, next)()
    }   

}