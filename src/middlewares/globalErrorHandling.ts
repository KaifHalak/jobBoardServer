import { HttpStatus } from "../utils/enums/httpStatusCodes";
import { Request, Response, NextFunction } from "express"

export function MissingParameters(req: Request, res: Response, next: NextFunction){
    return (...params: any[]) => {
        let statusCode = HttpStatus.BAD_REQUEST
        let error = params.map( (eachParam) => `'${eachParam }'`).join(" and/or ") + " missing"
        return res.status(statusCode).send({error})
    }
}

export function IncorrectParameters(req: Request, res: Response, next: NextFunction){
    return (errorMsg: string) => {
        let statusCode = HttpStatus.BAD_REQUEST
        let error = errorMsg
        return res.status(statusCode).send({error})
    }
}


export function UnauthorizedAccess(req: Request, res: Response, next: NextFunction){
    return () => {
        let statusCode = HttpStatus.UNAUTHORIZED
        let error = "Unauthorized access. Please login / signup"
        return res.status(statusCode).send({error})
    }
}

export function FailedLoginAttempt(req: Request, res: Response, next: NextFunction){
    return () => {
        let statusCode = HttpStatus.UNAUTHORIZED
        let error = "Incorrect email and password"
        return res.status(statusCode).send({error})
    }
}

export function AccountAlreadyExists(req: Request, res: Response, next: NextFunction){
    return () => {
        let statusCode = HttpStatus.CONFLICT
        let error = "Account with this email already exists"
        return res.status(statusCode).send({error})
    }
}


export function ServerError(req: Request, res: Response, next: NextFunction){
    return () => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        let error = "Server error. Please try again later"
        return res.status(statusCode).send({error})
    }
}


