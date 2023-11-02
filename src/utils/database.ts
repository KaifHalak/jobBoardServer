import mysql from "mysql2"
import env from "./env"
import util from "util"



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

    async GetUserEmail( userId: string ){
        try {
            let query = `SELECT email FROM users WHERE userId = '${userId}'`
            let results = await this.query(query)
            let email = results[0]?.email || null
            return email
        } catch (error) {
            console.log("Error getting user email", error)
            throw Error("Database Error!")
        }
    }


}


let db = new Database
export default db

