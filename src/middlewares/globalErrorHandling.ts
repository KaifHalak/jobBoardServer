import  HttpStatusCodes  from "../utils/enums/httpStatusCodes";
import { Request, Response, NextFunction } from "express"

// Function:
// Handle all errors

export function ServerError(req: Request, res: Response, next: NextFunction){
    return () => {
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        let error = "Server error. Please try again later"
        return res.status(statusCode).send({error})
    }
}

export function CustomError(req: Request, res: Response, next: NextFunction){
    return (error: string, statusCode: number) => {
        return res.status(statusCode).send({error})
    }   
}
