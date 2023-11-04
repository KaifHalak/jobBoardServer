import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken"
import path from "path"
import db from "@utils/database"


// Function:
// Send settings page to user

const settingsPage = path.join(__dirname, "../", "../", "../", "client", "public", "settingsUI", "index")

export async function GetSettings(req: Request, res: Response, next: NextFunction){

    let token = req.cookies["sessionToken"]
    let payload = VerifyToken(token)

    if (!payload){
        return res.redirect("/user/login")
    }

    let { userId } = payload
    let { username, email } = await db.GetUserEmailAndUsername(userId!)

    return res.render(settingsPage,{username, email})
}