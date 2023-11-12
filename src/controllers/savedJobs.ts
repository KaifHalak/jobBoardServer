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
        let allSavedJobIds = await db.GetAllSavedJobIds(userId)
        let allJobs = await db.GetSavedJobs(userId)
        return res.render(FILE_PATH, {allJobs, allSavedJobIds})
    } catch (error) {
        console.log("Error getting saved jobs:", error)
        ServerError(req, res, next)()
    }   

}


export async function POSTSaveJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!

        if (!userId){
            return res.send({url:"/user/login"})
        }

        let jobId = req.body.jobId
        await db.SaveJob(userId, jobId)
        return res.send({status:"Job saved successfully"})
    } catch (error) {
        console.log("Error getting saved jobs:", error)
        ServerError(req, res, next)()
    }   

}

export async function POSTUnSaveJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
        let jobId = req.body.jobId
        await db.UnSaveJob(userId, jobId)
        return res.send({status:"Job saved successfully"})
    } catch (error) {
        console.log("Error getting saved jobs:", error)
        ServerError(req, res, next)()
    }   

}