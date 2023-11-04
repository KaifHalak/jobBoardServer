import { Request, Response, NextFunction } from "express"
import { CreateToken, VerifyToken } from "@utils/security/jwtToken";
import { FailedLoginAttempt, IncorrectParameters, ServerError, AccountAlreadyExists } from "@middlewares/globalErrorHandling";
import env from "@utils/env";
import db from "@utils/database";

// Function:
// Process Login and SignUp Requests


export async function PostLogin(req: Request, res: Response, next: NextFunction){
    try {

    let {email, password} = req.body

    // Validation

    if (!ValidateEmail(email)){
        return IncorrectParameters(req, res, next)("Invalid email format")
    }

    if (!ValidatePassword(password)){
        return IncorrectParameters(req, res, next)("Password must be atleast 6 characters long")
    }

    let userId = await db.LoginUser(email, password)
    
    // If user doesn't exist
    if (!userId){
        return FailedLoginAttempt(req, res, next)()
    }

    let token = CreateToken({userId})
    AddCookie(res, token)
    return res.send({status:"Logged in successfully.", url:"/"})

    }

    catch (error) {
        console.log("Error logging in user:", error)
        return ServerError(req, res, next)()
    }

}

export async function PostSignUp(req: Request, res: Response, next: NextFunction){
   try {

    let {email, password, username} = req.body

    // Validation

    if (!username){
        return IncorrectParameters(req, res, next)("Username must have a value")
    }

    if (!ValidateEmail(email)){
        return IncorrectParameters(req, res, next)("Invalid email format")
    }

    if ( !ValidatePassword(password)){
        return IncorrectParameters(req, res, next)(`Password must be atleast 6 characters long`)
    }

    let userId = await db.CheckIfUserExists(email)

    if (userId){
        return AccountAlreadyExists(req, res, next)()
    }

    userId = await db.SignupUser(email, password, username)
    let token = CreateToken({userId: userId!})

    AddCookie(res, token)
    return res.send({status:"Signed Up  successfully.", url:"/"})

   } catch (error) {
    console.log("Error sigining up user:", error)
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

function AddCookie(res: Response, token: string){
    const options = {
        maxAge: eval(env("COOKIE_MAX_AGE")!),
        httpOnly: true
    }
    return res.cookie("sessionToken", token, options)
}