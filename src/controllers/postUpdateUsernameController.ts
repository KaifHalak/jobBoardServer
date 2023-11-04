import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken";
import db from "@utils/database";
import { ServerError, UnauthorizedAccess, IncorrectParameters } from "@middlewares/globalErrorHandling";

// Function:
// Update user's username

export async function PostUpdateUsername(req: Request, res: Response, next: NextFunction){
    
    try {
        let token = req.cookies["sessionToken"]
        let payload = VerifyToken(token)

        if (!payload){
            return UnauthorizedAccess(req, res, next)()
        }

        let { userId } = payload
        let { newUsername } = req.body

        if (!newUsername){
            return IncorrectParameters(req, res, next)("'newUsername missing from the body.'")
        }

        await db.UpdateUserEmail(newUsername, userId!)

        return res.send({status: "Username updated successfully"})


    } catch (error) {
        return ServerError(req, res, next)()
    }



}