import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken";
import db from "@utils/database";
import { ServerError, UnauthorizedAccess, IncorrectParameters } from "@middlewares/globalErrorHandling";



export async function PostUpdatePassword(req: Request, res: Response, next: NextFunction){
    
    try {
        let token = req.cookies["sessionToken"]
        let payload = VerifyToken(token)

        if (!payload){
            return UnauthorizedAccess(req, res, next)()
        }

        let { userId } = payload
        let { currentPassword, newPassword } = req.body

        if (!currentPassword){
            return IncorrectParameters(req, res, next)("'currentPassword' missing from the body")
        }

        if (!newPassword){
            return IncorrectParameters(req, res, next)("'newPassword' missing from the body")
        }

        if (!ValidatePassword(newPassword) || !(ValidatePassword(currentPassword))){
            return IncorrectParameters(req, res, next)("Password must be atleast 6 characters long")
        }

        let result = await db.UpdateUserPassword(currentPassword, newPassword, userId!)

        if (!result){
            return res.send({error: "Incorrect password"})

        }

        return res.send({status: "Password updated successfully"})


    } catch (error) {
        return ServerError(req, res, next)()
    }



}



function ValidatePassword(password: string){
    return (password.length >= 6)
}

