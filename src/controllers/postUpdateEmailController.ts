import { Request, Response, NextFunction } from "express"
import { VerifyToken } from "@utils/security/jwtToken";
import db from "@utils/database";
import { ServerError, UnauthorizedAccess, IncorrectParameters } from "@middlewares/globalErrorHandling";



export async function PostUpdateEmail(req: Request, res: Response, next: NextFunction){
    
    try {
        let token = req.cookies["sessionToken"]
        let payload = VerifyToken(token)

        if (!payload){
            return UnauthorizedAccess(req, res, next)()
        }

        let { userId } = payload
        let { newEmail, password } = req.body

        if (!newEmail){
            return IncorrectParameters(req, res, next)("'newEmail' missing from the body")
        }

        if (!password){
            return IncorrectParameters(req, res, next)("'passsword' missing from the body")
        }

        if (!ValidateEmail(newEmail)){
            return IncorrectParameters(req, res, next)("Incorrect email format")
        }

        let result = await db.UpdateUserEmail(newEmail, userId!, password)

        if (!result){
            return res.send({error: "Incorrect password"})

        }

        return res.send({status: "Email updated successfully"})


    } catch (error) {
        return ServerError(req, res, next)()
    }



}



function ValidateEmail(email: string){
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}
