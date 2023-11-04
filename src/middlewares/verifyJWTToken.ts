import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken";

// Function:
// Verify JWT Token

export function VerifyJWTToken(req: Request, res: Response, next: NextFunction){
    let token = req.cookies["sessionToken"] as string
    let payload = VerifyToken(token)

    if (!payload){
        return next()
    }

    return res.redirect("/")
}