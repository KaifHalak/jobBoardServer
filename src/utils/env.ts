import dotenv from "dotenv"
dotenv.config()

// Function
// Return env values in a more elegant way

// Instead of using 'process.env[key]', instead we can do env(key)

export default function env(key: string){
    return process.env[key] || null
}