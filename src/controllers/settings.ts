import { Response, NextFunction } from "express"
import path from "path"
import fs from "fs"

import { interfaceExpress } from "@utils/types/authTypes"
import { ServerError, CustomError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import db from "@utils/database"
import logger from "@utils/logger/dataLogger";
import { ValidateEmail, ValidatePassword, ValidateUsername } from "@utils/validators";




const SETTINGS_PAGE = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "settingsUI", "index")
const TEMP_IMAGE_FILE_PATH = path.join(__dirname, "../", "../","jobBoardUserImages", "temp")
const FINAL_IMAGE_FILE_PATH = path.join(__dirname, "../", "../","jobBoardUserImages", "final")

export async function GETSettings(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let { username, email } = await db.GetUserEmailAndUsername(userId)
        let { profilePicUrlPath } = await db.GetUserProfilePicURLPath(userId)

        if (!profilePicUrlPath){
            profilePicUrlPath = "default.png"
        }

        let profilePicFullURLPath = path.join(FINAL_IMAGE_FILE_PATH, profilePicUrlPath)
        
        const contents = fs.readFileSync(profilePicFullURLPath)
        const b64 = contents.toString('base64')
        const type = "png"

        logger.Events("GETSettings successfull", {userId, userIp})

        return res.render(SETTINGS_PAGE,{username, email, profilePic: `data:${type};base64,${b64}`})
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
            logger.Events("Incorrect password format: POSTUpdateEmail", {userId, userIp})
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
        logger.Fatal(error_, {userId, userIp})
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
            logger.Events("Incorrect password format: POSTUpdatePassword", {userId, userIp})
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
        logger.Fatal(error_, {userId, userIp})
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
        logger.Error(error_, {userId, userIp})
        return ServerError(req, res, next)()
    }



}

export async function POSTUpdateProfilePic(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!  

    try {

        let { fileStatus } = req.body as {fileStatus: string}

        let fileName = `${userId}.png`
        
        let tempImageFilePath = path.join(TEMP_IMAGE_FILE_PATH, fileName)
        let finalImageFilePath = path.join(FINAL_IMAGE_FILE_PATH, fileName)

        switch (fileStatus) {

            // Create a new image file in the temp folder
            case "start":
                fs.writeFileSync(tempImageFilePath, req.file!.buffer)
                res.send({status:"start"})
                break;
            
            // Append the image file in the temp folder
            case "in-progress":
                fs.appendFileSync(tempImageFilePath, req.file!.buffer)
                res.send({status:"in-progress"})
                break;

            // Append the final byte to the image file in the temp folder
            // Move the image from the temp folder to the final folder
            // This is to prevent the profile pic from corrupting incase something happens during byte transmission
            case "end":
                fs.appendFileSync(tempImageFilePath, req.file!.buffer)
                res.send({status:"end"})

                let readStream = fs.createReadStream(tempImageFilePath)
                let writeStream = fs.createWriteStream(finalImageFilePath)

                writeStream.on("finish", async () => {
                    fs.unlink(tempImageFilePath, () => {})

                    delete req.file

                    await db.UpdateProfilePicture(userId, fileName)
                })

                readStream.pipe(writeStream)

                break;

            default:
                return CustomError(req, res, next)("Please refresh your page", HttpStatusCodes.BAD_REQUEST)   
        }

        
    } catch (error) {
        let error_ = error as Error

        switch (error_.message) {
            case "chunk error":
                error_.message = "resend chunk"
                break;
        
            default:
                error_.message = "Error updating profile pic: POSTUpdateprofilePic"

        }

        logger.Error(error_, {userId, userIp})
        return ServerError(req, res, next)()

    }

}
 





