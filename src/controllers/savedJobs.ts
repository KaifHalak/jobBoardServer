import { Response, NextFunction } from "express"

import { ServerError } from "@middlewares/globalErrorHandling";

import { interfaceExpress } from "@utils/types/authTypes";

import path from "path"
import db from "@utils/database";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "savedJobsUI", "index.ejs")

export async function GETSavedJobsPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!

        let allJobs = await db.GetSavedJobs(userId)
        return res.render(FILE_PATH, {allJobs, allSavedJobIds: false})

    } catch (error) {
        console.log("Error getting saved jobs:", error)
        ServerError(req, res, next)()
    }   

}


export async function POSTSaveJob(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
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