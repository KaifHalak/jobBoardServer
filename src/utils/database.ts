import mysql from "mysql2"
import env from "./env"
import util from "util"
import { JobDetails } from "@utils/types/jobsTypes";


interface filters{
    role?: string,
    country?: string,
    city?: string,
    experience?: string,
    type?: string,
    offset?: string
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

        // Uncomment this when testing for SERVER ERROR
        // throw Error("")

        //@ts-ignore
        try {
            let query = `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`
            let results = await this.query(query, [email, password, username])
            let { insertId } = results
            return insertId 
        } catch (error) {
            console.log("Error inserting data into user's table", error)
            throw Error("Database Error!")
        }
    }

    async LoginUser(email: string, password: string):Promise<string | null>{

        // Uncomment this when testing for SERVER ERROR
        // throw Error("")

        //@ts-ignore
        try {
            let query = `SELECT userId FROM users WHERE email = ? AND password = ? `
            let result = await this.query(query, [email, password])
            let userId  = result[0]?.userId || null
            return userId
        } catch (error) {
            console.log("Error logging in user", error)
            throw Error("Database Error!")
        }
    }

    async CheckIfUserExists(email: string) : Promise<string | null>{
        try {
            let query = `SELECT userId FROM users WHERE email = ?`
            let results = await this.query(query, [email])
            let userId = results[0]?.userId || null
            return userId
        } catch (error) {
            console.log("Error checking if user exists", error)
            throw Error("Database Error!")
        }
    }

    async GetUserEmailAndUsername( userId: string ){
        try {
            let query = `SELECT email, username FROM users WHERE userId = ?`
            let results = await this.query(query,[userId])
            return results[0] || null
        } catch (error) {
            console.log("Error getting username and email", error)
            throw Error("Database Error!")
        }
    }
    
    async UpdateUserUsername(username: string, userId: string){
        try {
            let query = `UPDATE users SET username = ? WHERE userId = ?`
            await this.query(query, [username, userId])
            return true
        } catch (error) {
            console.log("Error updating username", error)
            throw Error("Database Error!")
        }
    }

    async UpdateUserEmail(email: string, userId: string, password: string){
        try {
            let query = `UPDATE users SET email = ? WHERE userId = ? AND password = ?`
            let results = await this.query(query, [email, userId, password])
            return results.changedRows // either 0 (failed )or 1 (successful)

        } catch (error) {
            console.log("Error updating email", error)
            throw Error("Database Error!")
        }
    }

    async UpdateUserPassword(currentPassword: string, newPassword: string ,userId: string){
        try {
            let query = `UPDATE users SET password = ? WHERE userId = ? AND password = ?`
            let results = await this.query(query, [newPassword, userId, currentPassword])
            return results.changedRows // either 0 (failed )or 1 (successful)

        } catch (error) {
            console.log("Error updating password", error)
            throw Error("Database Error!")
        }
    }


    // Jobs
    async CreateJob(paylaod: JobDetails, userId: string) {
    try {
        const query = `
        INSERT INTO jobs (jobTitle, country, city, aboutCompany, companyName, jobRequirements, jobDescription, views, experience, userId, type, lowerBoundMonthlyCompensation$, upperBoundMonthlyCompensation$, phone, email, linkedin, website, applicationDeadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
        paylaod.jobTitle,
        paylaod.country,
        paylaod.city,
        paylaod.aboutCompany,
        paylaod.companyName,
        paylaod.jobReq,
        paylaod.jobDesc,
        paylaod.experienceNeeded,
        userId,
        paylaod.employmentType,
        paylaod.minMonthlyCompen,
        paylaod.maxMonthlyCompen,
        paylaod.phoneNum,
        paylaod.email,
        paylaod.linkedin,
        paylaod.website,
        paylaod.applicationDeadline,
        ];

        await this.query(query, values);
        return true;
    } catch (error) {
        console.log("Error creating new job post:", error);
        throw new Error("Database error");
    }
    }
  
    async GetSavedJobs(userId: string){
        try {
            let query = `SELECT jobTitle, type, country, city, companyName, jobDescription, jobRequirements, experience, jobId FROM userSavedJobs WHERE userId = ?`
            let results = await this.query(query, [userId])
            return results
        } catch (error) {
            console.log("Error getting saved jobs from DB", error)
            throw Error("Database error")
        }
    }  
    
    async GetJob(jobId: string){
        try {
            let query = `SELECT * FROM jobs WHERE jobId = ?`
            let results = await this.query(query,[jobId])
            return results[0]
        } catch (error) {
            console.log("Error getting a job from DB", error)
            throw Error("Database error")
        }
    }

    async GetAllJobs(filters: filters) {
    try {
        const filterClauses: string[] = [];
        const filterValues: (string | number)[] = [];

        for (const key in filters) {
            let filterKey = key as keyof filters
            let value = filters[filterKey]!
            switch (key) {
                case "experience":
                    filterClauses.push(`experience < ?`);
                    filterValues.push(Number(value));
                    break;

                // Look for key words in job title and job requirements
                case "search":
                    filterClauses.push(`jobTitle LIKE ? OR jobRequirements LIKE ?`);
                    filterValues.push(`%${value}%`);
                    filterValues.push(`%${value}%`);
                    break;

                case "type":
                case "country": 
                case "city":
                    filterClauses.push(`${key} = ?`);
                    filterValues.push(value);
                    break;
            }

        }

        let query = `SELECT * FROM jobs`;

        if (filterClauses.length > 0) {
            query += ` WHERE ${filterClauses.join(" AND ")}`;
        }

        query += ` LIMIT 9 OFFSET ${Number(filters.offset) || 0}`
        // Execute the query with parameterized values
        let results = await this.query(query, filterValues);

        return results;

    } catch (error) {
        console.log("Error getting all jobs with filters from DB", error);
        throw new Error("Database error");
    }

}

    async GetAllSavedJobIds(userId: string){
        try {
            let query = `SELECT jobId FROM savedJobs WHERE userId = ?`
            let results = await this.query(query,[userId])
            let formattedResults = results.map((object: any ) => object.jobId)
            return formattedResults
        } catch (error) {
            console.log("Error getting all saved jobs ids from DB", error)
            throw Error("Database error")
        }
    }

    async SaveJob(userId: string, jobId: string){
        try {
            let query = `INSERT INTO savedJobs (userId, jobId) VALUES (?, ?)`
            await this.query(query, [userId, jobId])
            return true
        } catch (error) {
            console.log("Error saving job to db", error)
            throw Error("Database error")
        }
    }

    async UnSaveJob(userId: string, jobId: string){
        try {
            let query = `DELETE FROM savedJobs WHERE userId = ? AND jobId = ?`
            await this.query(query,[userId, jobId])
            return true
        } catch (error) {
            console.log("Error unsaving job from DB", error)
            throw Error("Database error")
        }
    }

}


let db = new Database
export default db

