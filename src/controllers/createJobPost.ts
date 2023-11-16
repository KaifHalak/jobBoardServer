import { Request, Response, NextFunction } from "express"

import { CustomError, ServerError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";

import { JobDetails } from "@utils/types/jobsTypes";
import { interfaceExpress } from "@utils/types/authTypes";

import { JobTypes, Locations } from "@utils/enums/jobPostDetails";

import path from "path"
import db from "@utils/database";

const FILE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "createJobPostUI", "index")

// Send user the file
export async function GETCreateJobPostPage(req: Request, res: Response, next: NextFunction){
    let countries = Locations
    res.render(FILE_PATH,{countries})
}


// Create the job post
export async function POSTCreateJobPost(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    try {
        let userId = req.userId!
       let payload: JobDetails =  req.body
       let validation = ValidatePayload(payload)

        if (validation?.error){
            return CustomError(req, res, next)(validation.error, HttpStatusCodes.BAD_REQUEST)
        }
    
        // Create job post in DB
        await db.CreateJob(payload, userId)

        return res.send({status:"Success"})

    } catch (error) {
        console.log("Error creating job post:", error)
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
    const upperJobTitleLen = 30 
    
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
        return {error: "Incorrect application deadline value"} 
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
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if ( !(emailPattern.test(payload.email)) ){
        return {error: "Incorrect email format. Please follow the example given"}
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
    let country = payload.country.toLowerCase().charAt(0).toUpperCase() + payload.country.slice(1)
    let cities = Locations[country] as string[]

    if ( !(cities.includes(payload.city)) ){
        return {error:"Incorrect city value"}
    }

}