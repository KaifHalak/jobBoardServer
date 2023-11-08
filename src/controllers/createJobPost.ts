import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";

import { JobDetails } from "@utils/types/jobsTypes";
import { interfaceExpress } from "@utils/types/authTypes";

import path from "path"
import fs from "fs"
import db from "@utils/database";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "createJobPostUI", "index")

// Send user the file
export async function GETCreateJobPostPage(req: Request, res: Response, next: NextFunction){
    let countries = ReadJSON()
    res.render(FILE_PATH,{countries})
}


// Create the job post
export async function POSTCreateJobPost(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
       let paylaod: JobDetails =  req.body

        // Validation

        if (
            !paylaod.country ||
            !paylaod.city ||
            !paylaod.employmentType ||
            !paylaod.jobTitle ||
            !paylaod.companyName ||
            !paylaod.aboutCompany ||
            !paylaod.jobDesc ||
            !paylaod.jobReq ||
            !paylaod.minMonthlyCompen ||
            !paylaod.maxMonthlyCompen ||
            !paylaod.applicationDeadline ||
            !paylaod.linkedin ||
            !paylaod.experienceNeeded
        ){
            return CustomError(req, res, next)("Please fill in the required fields", HttpStatusCodes.BAD_REQUEST)
        }


        
        if (!ValidatePhoneNum(paylaod.phoneNum)){
            return CustomError(req, res, next)("Incorrect phone number format", HttpStatusCodes.BAD_REQUEST)
        }


        if (!ValidateEmail(paylaod.email)){
            return CustomError(req, res, next)("Incorrect email format", HttpStatusCodes.BAD_REQUEST)
        }

        // Create job post in DB
        let results = await db.CreateJob(paylaod, userId)

        return res.send({status:"Success"})

    } catch (error) {
        console.log("Error creating job post:", error)
        ServerError(req, res, next)()
    }
}


// Helper Functions

function ReadJSON(){

    // JSON format:
    // {
    //   Country1: [cities],
    //   Country2: [cities],
    //   ....
    // }


    let data = fs.readFileSync(path.join(__dirname,"../", "../", "extras", "formattedWorlCities.json"), "utf8")
    let jsonData = JSON.parse(data)
    return jsonData
}

function ValidatePhoneNum(num: string){
    const regexPattern = /^\+\d{1,4}\s?\d+$/;
    return regexPattern.test(num)
}

function ValidateEmail(email: string){
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}