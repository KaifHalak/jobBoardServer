import dotenv from "dotenv"
dotenv.config()

export default function env(key: string){
    return process.env[key] || null
}