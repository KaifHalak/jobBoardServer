import { Request, Response, NextFunction } from "express"

import { VerifyToken } from "@utils/security/jwtToken";
import { interfaceExpress } from "@utils/types/authTypes";
import logger from "@utils/logger/dataLogger";

// Function:
// Verify JWT Token for authentication.

export default function VerifyJWTToken(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    let token = req.cookies["sessionToken"] as string
    let payload = VerifyToken(token)

    // If token invalid or expired
    if (!payload){

        logger.Events("User unauthorized: VerifyJWTToken", {userIp: req.ip!})

        // Redirect user to login page
        if (req.method === "GET"){
            return res.redirect("/user/login")
        }

        // To allow client side code to redirect user to login page
        if (req.method === "POST"){
            return res.send({url: "/user/login"})
        }

    }
    req.userId = payload?.userId
    logger.Events("User authorized: VerifyJWTToken", {userId: req.userId, userIp: req.ip!})
    return next()
}