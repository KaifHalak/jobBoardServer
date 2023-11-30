import { Response, NextFunction } from "express"
import path from "path"

import { interfaceExpress } from "@utils/types/authTypes"
import { ServerError, CustomError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import db from "@utils/database"
import logger from "@utils/logger/dataLogger";
import { ValidateEmail, ValidatePassword, ValidateUsername } from "@utils/validators";



const settingsPage = path.join(__dirname, "../", "../", "../", "client", "public", "settingsUI", "index")


export async function GETSettings(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let { username, email } = await db.GetUserEmailAndUsername(userId)
        
        logger.Events("GETSettings successfull", {userId, userIp})

        return res.render(settingsPage,{username, email})
    } catch (error) {
        let error_ = error as Error
        error_.message = "Error getting settings page: GETSettings"
        logger.Error(error_, {userId, userIp})
        ServerError(req, res, next)()
    }
}



export async function POSTUpdateEmail(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!

    try {

        let { newEmail, password } = req.body

        // Validation

        if (!newEmail){
            logger.Events("'newEmail' missing from the body: POSTUpdateEmail", {userId, userIp})
            return CustomError(req, res, next)("'newEmail' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!password){
            logger.Events("'passsword' missing from the body: POSTUpdateEmail", {userId, userIp})
            return CustomError(req, res, next)("'passsword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!(ValidatePassword(password))){
            logger.Events("Incorrect password: POSTUpdateEmail", {userId, userIp})
            return CustomError(req, res, next)("Password must be atleast 6 characters long", HttpStatusCodes.BAD_REQUEST)
        }

        if (!ValidateEmail(newEmail)){
            logger.Events("Incorrect email format: POSTUpdateEmail", {userId, userIp})
            return CustomError(req, res, next)("Incorrect email format", HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserEmail(newEmail, userId, password)

        if (!result){
            logger.Events("Incorrect password: POSTUpdateEmail", {userId, userIp})
            return CustomError(req, res, next)("Incorrect password", HttpStatusCodes.UNAUTHORIZED)
        }

        logger.Events("Email updated successfully: POSTUpdateEmail", {userId, userIp})
        return res.send({status: "Email updated successfully"})


    } catch (error) {
        let error_ = error as Error
        error_.message = "Error updating user email: POSTUpdateEmail"
        logger.Error(error_, {userId, userIp})
        return ServerError(req, res, next)()
    }



}

export async function POSTUpdatePassword(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    let userId = req.userId!
    let userIp = req.ip!

    try {

        let { currentPassword, newPassword } = req.body

        // Validation

        if (!currentPassword){
            logger.Events("'currentPassword' missing from the body: POSTUpdatePassword", {userId, userIp})
            return CustomError(req, res, next)("'currentPassword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!newPassword){
            logger.Events("'newPassword' missing from the body: POSTUpdatePassword", {userId, userIp})
            return CustomError(req, res, next)("'newPassword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!ValidatePassword(newPassword) || !(ValidatePassword(currentPassword))){
            logger.Events("Incorrect password length: POSTUpdatePassword", {userId, userIp})
            return CustomError(req, res, next)("Password must be atleast 6 characters long", HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserPassword(currentPassword, newPassword, userId)

        if (!result){
            logger.Events("Incorrect password: POSTUpdatePassword", {userId, userIp})
            return CustomError(req, res, next)("Incorrect password", HttpStatusCodes.UNAUTHORIZED)

        }
        logger.Events("Password updated successfully: POSTUpdatePassword", {userId, userIp})
        return res.send({status: "Password updated successfully"})


    } catch (error) {
        let error_ = error as Error
        error_.message = "Error updating password: POSTUpdatePassword"
        logger.Events(error_, {userId, userIp})
        return ServerError(req, res, next)()
    }



}

export async function POSTUpdateUsername(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let { newUsername } = req.body

        let result = ValidateUsername(newUsername)
        if (result != true){
            logger.Events("Invalid username: POSTUpdateUsername", {userId, userIp})
            return CustomError(req, res, next)(result.error, HttpStatusCodes.BAD_REQUEST)
        }

        await db.UpdateUserUsername(newUsername, userId!)
        logger.Events("Username updated successfully: POSTUpdateUsername", {userId, userIp})
        return res.send({status: "Username updated successfully"})


    } catch (error) {
        let error_ = error as Error
        error_.message = "Error updating username: POSTUpdateUsername"
        logger.Events(error_, {userId, userIp})
        return ServerError(req, res, next)()
    }



}