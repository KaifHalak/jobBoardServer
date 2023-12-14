import { Response, NextFunction } from "express"

import { VerifyToken } from "@utils/security/jwtToken";
import { CustomRequest } from "@utils/interfaces/authTypes";
import { logger } from "@utils/logger/dataLogger";

// Function:
// Verify JWT Token for authentication.

export default function VerifyAndProcessJWTToken(req: CustomRequest, res: Response, next: NextFunction){

    let token = req.cookies["sessionToken"] as string
    let payload = VerifyToken(token)

    let timeRemainingInMin = TimeRemainingBeforeExpMin(payload?.exp!)

    // If token is invalid or expired or 2 minutes are remaining before expiration
    if (!payload || timeRemainingInMin < 2){

        logger.events("User unauthorized: VerifyJWTToken", {userIp: req.ip!})

        // Redirect user to login page
        if (req.method === "GET"){
            return res.redirect("/user/login")
        }

        // To allow client side code to redirect user to login page
        if (req.method === "POST"){
            return res.send({url: "/user/login"})
        }

    }

    req.userId = payload!.userId
    logger.events("User authorized: VerifyJWTToken", {userId: req.userId, userIp: req.ip})
    return next()
}



function TimeRemainingBeforeExpMin(exp: number){
    let currentTimeMin = (new Date().getTime() / 1000) / 60
    return exp - currentTimeMin
}