import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken";
import db from "@utils/database";
import { IncorrectParameters, ServerError } from "@middlewares/globalErrorHandling";
import { JobDetails } from "@utils/types/jobsTypes";


export async function PostJobPost(req: Request, res: Response, next: NextFunction){
    try {
        
        let token = req.cookies['sessionToken']
        let tokenPayload = VerifyToken(token)
        let userId = tokenPayload?.userId

        if (!userId){
            return
        }

       let paylaod: JobDetails =  req.body


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
            return IncorrectParameters(req, res, next)("Please fill in the required fields")
        }


        
        if (!ValidatePhoneNum(paylaod.phoneNum)){
            return IncorrectParameters(req, res, next)("Incorrect phone number format")
        }


        if (!ValidateEmail(paylaod.email)){
            return IncorrectParameters(req, res, next)("Incorrect email format")
        }

        let results = await db.CreateJob(paylaod, userId)

        return res.send({status:"Success"})

    } catch (error) {
        ServerError(req, res, next)()
    }
}




function ValidatePhoneNum(num: string){
    const regexPattern = /^\+\d{1,4}\s?\d+$/;
    return regexPattern.test(num)
}

function ValidateEmail(email: string){
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}

