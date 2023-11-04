import { Request, Response, NextFunction } from "express"
import path from "path"

// Function:
// Send Login and SignUp pages

const loginPage = path.join(__dirname, "../", "../", "../", "client", "public", "loginUI", "index.html")
const signupPage = path.join(__dirname, "../", "../", "../", "client", "public", "signupUI", "index.html")

export function GetLogin(req: Request, res: Response, next: NextFunction){
    return res.sendFile(loginPage)
}

export function GetSignup(req: Request, res: Response, next: NextFunction){
    return res.sendFile(signupPage)
}