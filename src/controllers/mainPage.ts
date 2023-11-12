import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";

import { interfaceExpress } from "@utils/types/authTypes";

import db from "@utils/database";
import path from "path"

const FILE_PATH = path.join(__dirname, "../", "../", "../",  "client", "public", "mainUI", "index")

export default async function MainPage(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
        let allJobs = await db.GetAllJobs()
        let allSavedJobIds = []
        if (userId){
            allSavedJobIds = await db.GetAllSavedJobIds(userId)
        }
        res.render(FILE_PATH, {allJobs, allSavedJobIds})

    } catch (error) {
        console.log("Error sending user the main page:", error)
        ServerError(req, res, next)()
    }
}