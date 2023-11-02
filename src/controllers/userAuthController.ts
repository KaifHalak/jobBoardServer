import { Request, Response, NextFunction } from "express"
import { CreateToken, VerifyToken } from "@utils/security/jwtToken";
import { MissingParameters, UnauthorizedAccess, IncorrectParameters } from "@middlewares/globalErrorHandling";
import env from "@utils/env";

export function Login(req: Request, res: Response, next: NextFunction){
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

    // Database authentication...
    userId = "1"
    token = CreateToken({userId})

    return res.send({status:"Logged in successfully."})

}

export function SignUp(req: Request, res: Response, next: NextFunction){
    let {email, password} = req.body

    if (!email || !password){
        MissingParameters(req, res, next)("email","password")
    }

    if (!ValidateEmail(email)){
        return IncorrectParameters(req, res, next)("Invalid email address")
    }

    if ( !ValidatePassword(password)){
        IncorrectParameters(req, res, next)(`Password must be atleast ${Number(env("PASSWORD_LENGTH")!)} characters long`)
    }

    // Database authentication...
    let userId = "1"
    let token = CreateToken({userId})

    res.header("authorization", token)
    return res.send({status:"Signed Up  successfully."})
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