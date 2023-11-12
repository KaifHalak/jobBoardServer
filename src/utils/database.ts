import mysql from "mysql2"
import env from "./env"
import util from "util"
import { JobDetails } from "@utils/types/jobsTypes";


interface filters{
    [key: string] : string | undefined;
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string
}


class Database{
    private pool: mysql.Pool
    private query: any

    constructor(){
        this.pool = mysql.createPool({
            host: env("DB_HOST")!,
            user: env("DB_USER")!,
            password: env("DB_PASSWORD")!,
            database: env("DB_NAME")!
        })   
        this.query = util.promisify(this.pool.query).bind(this.pool)

    }

    // User

    async SignupUser(email: string, password: string, username: string){
        try {
            let query = `INSERT INTO users (email, password, username) VALUES ('${email}', '${password}', '${username}')`
            let results = await this.query(query)
            let { insertId } = results
            return insertId 
        } catch (error) {
            console.log("Error inserting data into user's table", error)
            throw Error("Database Error!")
        }
    }

    async LoginUser(email: string, password: string):Promise<string | null>{
        try {
            let query = `SELECT userId FROM users WHERE email = '${email}' AND password = '${password}' `
            let result = await this.query(query)
            let userId  = result[0]?.userId || null
            return userId
        } catch (error) {
            console.log("Error logging in user", error)
            throw Error("Database Error!")
        }
    }

    async CheckIfUserExists(email: string) : Promise<string | null>{
        try {
            let query = `SELECT userId FROM users WHERE email = '${email}'`
            let results = await this.query(query)
            let userId = results[0]?.userId || null
            return userId
        } catch (error) {
            console.log("Error checking if user exists", error)
            throw Error("Database Error!")
        }
    }

    async GetUserEmailAndUsername( userId: string ){
        try {
            let query = `SELECT email, username FROM users WHERE userId = '${userId}'`
            let results = await this.query(query)
            return results[0] || null
        } catch (error) {
            console.log("Error getting user email", error)
            throw Error("Database Error!")
        }
    }
    
    async UpdateUserUsername(username: string, userId: string){
        try {
            let query = `UPDATE users SET username = '${username}' WHERE userId = '${userId}'`
            let results = await this.query(query)
            return true
        } catch (error) {
            console.log("Error updating user email", error)
            throw Error("Database Error!")
        }
    }

    async UpdateUserEmail(email: string, userId: string, password: string){
        try {
            let query = `UPDATE users SET email = '${email}' WHERE userId = '${userId}' AND password = '${password}'`
            let results = await this.query(query)
            return results.changedRows // either 0 (failed )or 1 (successful)

        } catch (error) {
            console.log("Error updating user email", error)
            throw Error("Database Error!")
        }
    }

    async UpdateUserPassword(currentPassword: string, newPassword: string ,userId: string){
        try {
            let query = `UPDATE users SET password = '${newPassword}' WHERE userId = '${userId}' AND password = '${currentPassword}'`
            let results = await this.query(query)
            return results.changedRows // either 0 (failed )or 1 (successful)

        } catch (error) {
            console.log("Error updating user email", error)
            throw Error("Database Error!")
        }
    }


    // Jobs

    async CreateJob(paylaod: JobDetails, userId: string){
        try {
            let query = `INSERT INTO jobs (jobTitle, country, city, aboutCompany, companyName, jobRequirements, jobDescription, views, experience, userId, type, lowerBoundMonthlyCompensation$, upperBoundMonthlyCompensation$,
                phone, email, linkedin, website, applicationDeadline)
            VALUES ('${paylaod.jobTitle}', '${paylaod.country}', '${paylaod.city}', '${paylaod.aboutCompany}', '${paylaod.companyName}', '${paylaod.jobReq}', '${paylaod.jobDesc}', '0', '${paylaod.experienceNeeded}', '${userId}', '${paylaod.employmentType}', '${paylaod.minMonthlyCompen}', '${paylaod.maxMonthlyCompen}', '${paylaod.phoneNum}', '${paylaod.email}', '${paylaod.linkedin}', '${paylaod.website}', '${paylaod.applicationDeadline}')`

            let results = await this.query(query)
            return true
        } catch (error) {
            console.log("Error inserting new job post into DB:", error)
            throw Error("Database error")
        }
    }    

    async GetSavedJobs(userId: string){
        try {
            // let query = `SELECT jobTitle, country, city, type, companyName, jobRequirements, jobDescription, experience FROM userSavedJobs WHERE userId = ${userId}`
            let query = `SELECT * FROM userSavedJobs WHERE userId = ${userId}`

            let results = await this.query(query)
            return results
        } catch (error) {
            console.log("Error getting saved jobs from DB", error)
            throw Error("Database error")
        }
    }  
    
    async GetJob(jobId: string){
        try {
            let query = `SELECT * FROM jobs WHERE jobId = ${jobId}`
            let results = await this.query(query)
            return results[0]
        } catch (error) {
            console.log("Error getting saved jobs from DB", error)
            throw Error("Database error")
        }
    }

    async GetAllJobs(filters: filters){
        try {

            let queryFilters = ""

            for (let key in filters){

                switch (key) {
                    case "experience":
                        queryFilters += `${key} < ${filters[key]} AND `
                        break;
                
                    default:
                        queryFilters += `${key} = '${filters[key]}' AND `
                        break;
                }

            }
            queryFilters = queryFilters.slice(0, -5)

            if (queryFilters){
                queryFilters = `WHERE ${queryFilters}`
            }

            let query = `SELECT * FROM jobs ${queryFilters}`
            let results = await this.query(query)
            return results
        } catch (error) {
            console.log("Error getting all jobs from DB", error)
            throw Error("Database error")
        }
    }

    async GetAllSavedJobIds(userId: string){
        try {
            let query = `SELECT jobId FROM savedJobs WHERE userId = ${userId}`
            let results = await this.query(query)
            let formattedResults = results.map((object: any ) => object.jobId)
            return formattedResults
        } catch (error) {
            console.log("Error getting all saved jobs ids from DB", error)
            throw Error("Database error")
        }
    }

    async SaveJob(userId: string, jobId: string){
        try {
            let query = `INSERT INTO savedJobs (userId, jobId) VALUES ('${userId}', '${jobId}')`
            await this.query(query)
            return true
        } catch (error) {
            console.log("Error saving jobs to db", error)
            throw Error("Database error")
        }
    }


    async UnSaveJob(userId: string, jobId: string){
        try {
            let query = `DELETE FROM savedJobs WHERE userId = '${userId}' AND jobId = '${jobId}'`
            await this.query(query)
            return true
        } catch (error) {
            console.log("Error unsaving jobs from DB", error)
            throw Error("Database error")
        }
    }

}


let db = new Database
export default db

