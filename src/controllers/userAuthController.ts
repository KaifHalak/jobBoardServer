import { Request, Response, NextFunction } from "express"
import { CreateToken, VerifyToken } from "@utils/security/jwtToken";
import { MissingParameters, FailedLoginAttempt, IncorrectParameters, ServerError, AccountAlreadyExists } from "@middlewares/globalErrorHandling";
import env from "@utils/env";
import db from "@utils/database";

export async function Login(req: Request, res: Response, next: NextFunction){
    try {
    let token = req.headers.authorization!
    let userId = VerifyToken(token)

    if (userId){
        return next()
    }

    let {email, password} = req.body

    if (!email || !password){
        return MissingParameters(req, res, next)("email","password")
    }

    if (!ValidateEmail(email) || !ValidatePassword(password)){
        return IncorrectParameters(req, res, next)("Invalid email address and/or password")
    }

    userId = await db.LoginUser(email, password)
    
    if (!userId){
        return FailedLoginAttempt(req, res, next)()
    }

    token = CreateToken({userId})
    res.set('Authorization', token);
    return res.send({status:"Logged in successfully."})

    }

    catch (error) {
        return ServerError(req, res, next)()
    }

}

export async function SignUp(req: Request, res: Response, next: NextFunction){
   try {
    let {email, password, username} = req.body

    if (!email || !password || !username){
        return MissingParameters(req, res, next)("email","password", "username")
    }

    if (!ValidateEmail(email)){
        return IncorrectParameters(req, res, next)("Invalid email address")
    }

    if ( !ValidatePassword(password)){
        return IncorrectParameters(req, res, next)(`Password must be atleast ${Number(env("PASSWORD_LENGTH")!)} characters long`)
    }

    // Database authentication...
    let userId = await db.CheckIfUserExists(email)

    if (userId){
        return AccountAlreadyExists(req, res, next)()
    }

    userId = await db.SignupUser(email, password, username)
    let token = CreateToken({userId: userId!})

    res.header("Authorization", token)
    return res.send({status:"Signed Up  successfully."})

   } catch (error) {
    return ServerError(req, res, next)()
   }
}



function ValidateEmail(email: string){
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}

function ValidatePassword(password: string){
    let length = Number(env("PASSWORD_LENGTH")!)
    if (password.length >= length){
        return true
    }
    return false
}