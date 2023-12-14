import { Response, NextFunction } from "express"
import path from "path"
import fs from "fs"

import { CustomRequest } from "@utils/interfaces/authTypes"
import { ServerError, CustomError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import db from "@utils/database"
import logger from "@utils/logger/dataLogger";
import { ValidateEmail, ValidatePassword, ValidateUsername } from "@utils/validators";


// Function:
// Settings Page UI and its related operations

const SETTINGS_PAGE = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "settingsUI", "index")
const TEMP_IMAGE_FILE_PATH = path.join(__dirname, "../", "../","jobBoardUserImages", "temp")
const FINAL_IMAGE_FILE_PATH = path.join(__dirname, "../", "../","jobBoardUserImages", "final")

export async function GETSettings(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let { username, email } = await db.GetUserEmailAndUsername(userId)
        let { profilePicUrlPath } = await db.GetUserProfilePicURLPath(userId)

        // If user doesnt have a profile pic set, set it to the default one
        if (!profilePicUrlPath){
            profilePicUrlPath = "default.png"
        }

        let profilePicFullURLPath = path.join(FINAL_IMAGE_FILE_PATH, profilePicUrlPath)
        
        // convert image to base64 url
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



export async function POSTUpdateEmail(req: CustomRequest, res: Response, next: NextFunction){
    
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

        let validateResult: boolean | {error: string}
        validateResult = ValidatePassword(password)
        if (validateResult !== true){
            logger.Events(`${validateResult.error}: POSTUpdateEmail`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
        }

        validateResult = ValidateEmail(newEmail)
        if (validateResult !== true){
            logger.Events(`${validateResult.error}: POSTUpdateEmail`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserEmail(newEmail, userId, password)

        // if password is incorrect

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

export async function POSTUpdatePassword(req: CustomRequest, res: Response, next: NextFunction){
    
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

        let validateResult: boolean | {error: string}

        validateResult = ValidatePassword(newPassword)
        if (validateResult !== true){
            logger.Events(`${validateResult.error}: POSTUpdatePassword`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
        }

        validateResult = ValidatePassword(currentPassword)
        if (validateResult !== true){
            logger.Events(`${validateResult.error}: POSTUpdatePassword`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserPassword(currentPassword, newPassword, userId)

        // if password is incorrect

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

export async function POSTUpdateUsername(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!

    try {
        let { newUsername } = req.body

        let result = ValidateUsername(newUsername)
        if (result != true){
            logger.Events(`${result.error}: POSTUpdateUsername`, {userId, userIp})
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

export async function POSTUpdateProfilePic(req: CustomRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let userIp = req.ip!  

    try {

        let { fileStatus } = req.body as {fileStatus: "start" | "in-progress" | "end"}

        let fileName = `${userId}.png`
        
        let tempImageFilePath = path.join(TEMP_IMAGE_FILE_PATH, fileName)
        let finalImageFilePath = path.join(FINAL_IMAGE_FILE_PATH, fileName)

        // Initially, the image will be stored in a temp folder.
        // Once all of the image bytes are recieved, the image is moved to "final" folder

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

                    // Multer will store the bytes in memory.
                    // Free up memory when the whole image is recieved
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
        // Come back later
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
 





