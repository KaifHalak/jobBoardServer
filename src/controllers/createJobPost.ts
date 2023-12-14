import { Response, NextFunction } from "express"
import path from "path"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import { JobDetails } from "@utils/interfaces/jobsTypes";
import { CustomRequest } from "@utils/interfaces/authTypes";
import { JobTypes, Locations } from "@utils/enums/jobPostDetails";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";
import { ValidateEmail } from "@utils/validators";


// Function:
// CreateJobPost UI and its related operations

const CREATE_JOB_POST_UI_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "createJobPostUI", "index")


export async function GETCreateJobPostPage(req: CustomRequest, res: Response, next: NextFunction){

    // Send user the file
    let userIp = req.ip
    let userId = req.userId
    logger.Events("GETCreateJobPostPage successfull", {userIp, userId})

    res.render(CREATE_JOB_POST_UI_PATH,{countries: Locations})

}


// Create the job post
export async function POSTCreateJobPost(req: CustomRequest, res: Response, next: NextFunction){
    
    let userIp = req.ip!
    let userId = req.userId!

    try {
        // Contains info about the Job Post such as Title, Job Description, Job Requirements etc
        let payload: JobDetails =  req.body
        let validation = ValidatePayload(payload)

        if (validation?.error){
            logger.Events("Payload validation failed: POSTCreateJobPost", {userId, userIp})
            return CustomError(req, res, next)(validation.error, HttpStatusCodes.BAD_REQUEST)
        }
    
        // Create job post in DB
        await db.CreateJob(payload, userId)

        logger.Events("Job post created successfully: POSTCreateJobPost", {userId, userIp, payload})
        return res.send({status:"Success"})

    } catch (error) {
        let error_ = error as Error
        error_.message = "Error creating job post: POSTCreateJobPost"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }
}


// Helper Functions

function ValidatePayload(payload: JobDetails){
    if (
        !payload.country ||
        !payload.city ||
        !payload.employmentType ||
        !payload.jobTitle ||
        !payload.companyName ||
        !payload.aboutCompany ||
        !payload.jobDesc ||
        !payload.jobReq ||
        !payload.minMonthlyCompen ||
        !payload.maxMonthlyCompen ||
        !payload.applicationDeadline ||
        !payload.experienceNeeded
    ){
        return {error: "Please fill in the required fields"}
    }



    // employment type
    let allJobTypes = Object.values(JobTypes) as string[]
    allJobTypes = allJobTypes.map(type => type.toLowerCase())

    if (!allJobTypes.includes( payload.employmentType.toLowerCase() )){
        return {error: "Incorrect job type"}
    }

    // job title
    const lowerJobTitleLen = 5
    const upperJobTitleLen = 50
    
    let jobTitleLen = payload.jobTitle.length
    if ( !(jobTitleLen >= lowerJobTitleLen && jobTitleLen <= upperJobTitleLen) ){
        return {error: `Job title must be between ${lowerJobTitleLen} and ${upperJobTitleLen} characters`}
    }

    // job desc
    const lowerJobDescLen = 50
    const upperJobDescLen = 3000

    let jobDescLen = payload.jobDesc.length
    if( !(jobDescLen >= lowerJobDescLen && jobDescLen <= upperJobDescLen) ){
        return {error: `Job description must be between ${lowerJobDescLen} and ${upperJobDescLen} characters`}
    }

    // job requriement
    const lowerJobRequirementLen = 50
    const upperJobRequirementLen = 3000

    let jobRequirementLen = payload.jobReq.length
    if( !(jobRequirementLen >= lowerJobRequirementLen && jobRequirementLen <= upperJobRequirementLen) ){
        return {error: `Job requirements must be between ${lowerJobRequirementLen} and ${upperJobRequirementLen} characters`}
    }

    // experience
    if ( !(Number(payload.experienceNeeded)) ){
        return {error: "Incorrect job experience value"}
    }

    // deadline
    let datePattern = /^\d{4}-\d{2}-\d{2}$/
    if ( !(datePattern.test(payload.applicationDeadline)) ){
        return {error: "Incorrect application deadline"} 
    }

    // compensation
    let minComp = Number(payload.minMonthlyCompen)
    let maxComp = Number(payload.maxMonthlyCompen)
    if ( !( minComp && maxComp ) ){
        return {error: "Incorrect compensation values"} 
    }

    if ( !(maxComp >= minComp) ){
        return {error: "Max compensation must be greater than or equal to min compensation"} 
    }


    // email
    let validateResult = ValidateEmail(payload.email)
    if ( validateResult !== true ){
        return {error: validateResult.error}
    }

    // phone
    let phonePattern = /^\+\d{1,4}\s?\d+$/;
    if ( !(phonePattern.test(payload.phoneNum)) ){
        return {error: "Incorrect phone number format. Please follow the example given"}
    }

    // company name
    const lowerCompanyNameLen = 5
    const upperCompanyNameLen = 30

    let companyNameLen = payload.companyName.length
    if( !(companyNameLen >= lowerCompanyNameLen && companyNameLen <= upperCompanyNameLen) ){
        return {error: `Company name must be between ${lowerCompanyNameLen} and ${upperCompanyNameLen} characters`}
    }

    // about company
    const lowerAboutCompanyLen = 50
    const upperAboutCompanyLen = 3000

    let aboutCompanyLen = payload.aboutCompany.length
    if( !(aboutCompanyLen >= lowerAboutCompanyLen && aboutCompanyLen <= upperAboutCompanyLen) ){
        return {error: `About company must be between ${lowerAboutCompanyLen} and ${upperAboutCompanyLen} characters`}
    }


    // country
    let allCountries = Object.keys(Locations)
    allCountries = allCountries.map(country => country.toLowerCase())

    if ( !(allCountries.includes(payload.country.toLowerCase())) ){
        return {error:"Incorrect country value"}
    }

    //city
    let country = payload.country.toLowerCase().charAt(0).toUpperCase() + payload.country.slice(1) as keyof typeof Locations

    let cities = Locations[country] as string[]

    if ( !(cities.includes(payload.city)) ){
        return {error:"Incorrect city value"}
    }

}