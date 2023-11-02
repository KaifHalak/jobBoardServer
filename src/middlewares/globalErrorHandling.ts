import { HttpStatus } from "../utils/enums/httpStatusCodes";
import { Request, Response, NextFunction } from "express"

export function MissingParameters(req: Request, res: Response, next: NextFunction){
    return (...params: any[]) => {
        let statusCode = HttpStatus.BAD_REQUEST
        let error = params.map( (eachParam) => `'${eachParam }'`).join(" and/or ") + " missing from the body"
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

