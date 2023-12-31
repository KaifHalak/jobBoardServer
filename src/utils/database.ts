import mysql from "mysql2"
import env from "./env"
import util from "util"
import { JobDetails } from "@utils/interfaces/jobsTypes";
import { DatabaseCatchError } from "./catchError";


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

        try {
            let query = `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`
            let results = await this.query(query, [email, password, username])
            let { insertId } = results
            return {userId: insertId }
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.SignupUser.name}()`)
        }
    }

    async LoginUser(email: string, password: string){

        try {
            let query = `SELECT userId FROM users WHERE email = ? AND password = ? `
            let result = await this.query(query, [email, password])
            let userId: string | undefined  = result[0]?.userId
            return { userId }
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.LoginUser.name}()`)
        }
    }

    async CheckIfUserExists(email: string){
        try {
            let query = `SELECT userId FROM users WHERE email = ?`
            let results = await this.query(query, [email])
            let userId: string | undefined = results[0]?.userId
            return { userId }
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.CheckIfUserExists.name}()`)
        }
    }


    async GetUserEmailAndUsername( userId: string ){
        try {
            let query = `SELECT email, username FROM users WHERE userId = ?`
            let results = await this.query(query,[userId])
            return results[0] || null
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetUserEmailAndUsername.name}()`)
        }
    }

    async GetUserProfilePicURLPath( userId: string ){
        try {
            let query = `SELECT profilePicUrlPath FROM users WHERE userId = ?`
            let profilePicPath = (await this.query(query,[userId]))[0].profilePicUrlPath as string
            return {profilePicPath}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetUserProfilePicURLPath.name}()`)
        }
    }


    async GetUsername( userId: string ){
        try {
            let query = `SELECT username FROM users WHERE userId = ?`
            let username = (await this.query(query,[userId]))[0].username as string
            return {username}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetUsername.name}()`)
        }
    }
    
    async UpdateUsername(username: string, userId: string){
        try {
            let query = `UPDATE users SET username = ? WHERE userId = ?`
            let changedRows = (await this.query(query, [username, userId])).changedRows as number
            return {changedRows}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.UpdateUsername.name}()`)
        }
    }

    async UpdateUserEmail(email: string, userId: string, password: string){
        try {
            let query = `UPDATE users SET email = ? WHERE userId = ? AND password = ?`
            let changedRows = (await this.query(query, [email, userId, password])).changedRows as number
            return {changedRows} // either 0 (failed) or 1 (success)

        } catch (error) {  
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.UpdateUserEmail.name}()`)
        }
    }

    async UpdateUserPassword(currentPassword: string, newPassword: string ,userId: string){
        try {
            let query = `UPDATE users SET password = ? WHERE userId = ? AND password = ?`
            let changedRows = (await this.query(query, [newPassword, userId, currentPassword])).changedRows as number
            return {changedRows} // either 0 (failed )or 1 (successful)

        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.UpdateUserPassword.name}()`)
        }
    }

    async UpdateProfilePicture(userId: string, urlPath: string){
        try {
            let query = `UPDATE users SET profilePicUrlPath = ? WHERE userId = ?`
            let changedRows = (await this.query(query,[urlPath, userId])).changedRows as number
            return {changedRows}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.UpdateProfilePicture.name}()`)
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

        let changedRows = (await this.query(query, values)).changedRows as number
        return {changedRows};
    } catch (error) {
        let error_ = error as Error
        throw DatabaseCatchError(error_, `database/${this.CreateJob.name}()`)
    }
    }
  
    async GetSavedJobs(userId: string){
        try {
            let query = `SELECT jobTitle, type, country, city, companyName, jobDescription, jobRequirements, experience, jobId FROM userSavedJobs WHERE userId = ?`
            let results = (await this.query(query, [userId])) as IJobOverview[]
            return results
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetSavedJobs.name}()`)
        }
    }  

    async GetCreatedJobs(userId: string, offset: Number = 0){ 
        try {
            let query = `SELECT jobTitle, type, country, city, companyName, jobDescription, jobRequirements, experience, jobId FROM jobs WHERE userId = ? LIMIT 9 OFFSET ?`
            let results = (await this.query(query, [userId, offset])) as IJobOverview[]
            return results
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetCreatedJobs.name}()`)
        }
    }  

    async DeleteJob(userId: string, jobId: number){
        try {
            // Check if the user has that job
            let query = "SELECT jobId FROM jobs WHERE jobId = ? AND userId = ?"
            let results = await this.query(query, [jobId,userId])

            if (!results[0]){
                return false
            }

            query = `DELETE FROM savedJobs WHERE jobId = ?`
            await this.query(query, [jobId])
            query = `DELETE FROM jobs WHERE jobId = ? AND userId = ?`
            await this.query(query, [jobId,userId])
            return true
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.DeleteJob.name}()`)
        }
    } 

    async GetJob(jobId: string){
        try {
            let query = `SELECT * FROM jobs WHERE jobId = ?`
            let results = await this.query(query,[jobId])
            return results[0]
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetJob.name}()`)
        }
    }

    async IncrementViewCounter(jobId: string){
        try {
            let query = `SELECT views FROM jobs WHERE jobId = ?`
            let results = await this.query(query,[jobId])

            let views = results[0].views as number

            query = "UPDATE jobs SET views = ? WHERE jobId = ?"
            await this.query(query,[views + 1,jobId])

        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.IncrementViewCounter.name}()`)
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
        let error_ = error as Error
        throw DatabaseCatchError(error_, `database/${this.GetAllJobs.name}()`)
    }

}

    async GetAllSavedJobIds(userId: string){
        try {
            let query = `SELECT jobId FROM savedJobs WHERE userId = ?`
            let results = await this.query(query,[userId])
            // An array of jobIds which the user has saved
            let formattedResults = results.map((object: any ) => object.jobId) as number[]
            return formattedResults
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.GetAllSavedJobIds.name}()`)
        }
    }

    async SaveJob(userId: string, jobId: string){
        try {
            let query = `INSERT INTO savedJobs (userId, jobId) VALUES (?, ?)`
            let changedRows = (await this.query(query, [userId, jobId])).changedRows as number
            return {changedRows}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.SaveJob.name}()`)
        }
    }

    async UnSaveJob(userId: string, jobId: string){
        try {
            let query = `DELETE FROM savedJobs WHERE userId = ? AND jobId = ?`
            let changedRows = await this.query(query,[userId, jobId]).changedRows as number
            return {changedRows}
        } catch (error) {
            let error_ = error as Error
            throw DatabaseCatchError(error_, `database/${this.UnSaveJob.name}()`)
        }
    }

}


let db = new Database
export default db

interface IJobOverview {
    jobTitle: string,
    type: string,
    country: string,
    city: string,
    companyName: string,
    jobDescription: string,
    jobRequirements: string,
    experience: number,
    jobId: string

}

