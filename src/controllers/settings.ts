import { Response, NextFunction } from "express"

import { interfaceExpress } from "@utils/types/authTypes"

import { ServerError, CustomError } from "@middlewares/globalErrorHandling";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";

import path from "path"
import db from "@utils/database"



const settingsPage = path.join(__dirname, "../", "../", "../", "client", "public", "settingsUI", "index")


export async function GETSettings(req: interfaceExpress.customRequest, res: Response, next: NextFunction){

    let userId = req.userId!
    let { username, email } = await db.GetUserEmailAndUsername(userId)

    return res.render(settingsPage,{username, email})
}



export async function POSTUpdateEmail(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    try {

        let userId = req.userId!
        let { newEmail, password } = req.body

        // Validation

        if (!newEmail){
            return CustomError(req, res, next)("'newEmail' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!password){
            return CustomError(req, res, next)("'passsword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!ValidateEmail(newEmail)){
            return CustomError(req, res, next)("Incorrect email format", HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserEmail(newEmail, userId!, password)

        if (!result){
            return CustomError(req, res, next)("Incorrect password", HttpStatusCodes.UNAUTHORIZED)
        }

        return res.send({status: "Email updated successfully"})


    } catch (error) {
        console.log("Error updating user email:", error)
        return ServerError(req, res, next)()
    }



}

export async function POSTUpdatePassword(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    try {

        let userId = req.userId!
        let { currentPassword, newPassword } = req.body

        // Validation

        if (!currentPassword){
            return CustomError(req, res, next)("'currentPassword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!newPassword){
            return CustomError(req, res, next)("'newPassword' missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        if (!ValidatePassword(newPassword) || !(ValidatePassword(currentPassword))){
            return CustomError(req, res, next)("Password must be atleast 6 characters long", HttpStatusCodes.BAD_REQUEST)
        }

        let result = await db.UpdateUserPassword(currentPassword, newPassword, userId!)

        if (!result){
            return CustomError(req, res, next)("Incorrect password", HttpStatusCodes.UNAUTHORIZED)

        }

        return res.send({status: "Password updated successfully"})


    } catch (error) {
        console.log("Error updating user password:", error)
        return ServerError(req, res, next)()
    }



}

export async function POSTUpdateUsername(req: interfaceExpress.customRequest, res: Response, next: NextFunction){
    
    try {
        let userId = req.userId!
        let { newUsername } = req.body

        if (!newUsername){
            return CustomError(req, res, next)("'newUsername missing from the body.'", HttpStatusCodes.BAD_REQUEST)
        }

        await db.UpdateUserUsername(newUsername, userId!)

        return res.send({status: "Username updated successfully"})


    } catch (error) {
        console.log("Error updating user username:", error)
        return ServerError(req, res, next)()
    }



}

// Helper Functions

function ValidateEmail(email: string){
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}

function ValidatePassword(password: string){
    return (password.length >= 6)
}