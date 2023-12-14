import { Request, Response, NextFunction } from "express"

import { ServerError } from "@middlewares/globalErrorHandling"
import { TLoggerEvents, logger } from "./logger/dataLogger"

// Function
// Format errors caught in Controllers and DB

export function ControllerCatchError(req:Request, res: Response, next: NextFunction){

    return (error: Error, path: string, loggerEvent: TLoggerEvents, loggerPayload: Record<string, any>) => {
        // Ex. Function: userAuth/POSTSignUp()
        //      Error Stack
        error.message = `Function: ${path}\n` + error.message
        logger[loggerEvent](error, loggerPayload)
        ServerError(req, res, next)()

    }
}   

export function DatabaseCatchError(error: Error, path: string){
    // Ex. Function: database/SignupUser()
    //      Error Stack
    error.message = `DB: ${path}\n` + error.message
    return error

}
