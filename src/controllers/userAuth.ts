import { Request, Response, NextFunction } from "express"
import path from "path"

import { CreateToken } from "@utils/security/jwtToken";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import {  ServerError, CustomError } from "@middlewares/globalErrorHandling";
import env from "@utils/env";
import db from "@utils/database";
import { logger } from "@utils/logger/dataLogger";
import { ValidateEmail, ValidatePassword, ValidateUsername } from "@utils/validators";
import { ControllerCatchError } from "@utils/catchError";

// Function:
// Process Login and SignUp Requests

const LOGIN_PAGE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "loginUI", "index.html")
const SIGNUP_PAGE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "signupUI", "index.html")


export async function POSTLogin(req:Request, res: Response, next: NextFunction){
    
    let userId: string | undefined
    let userIp = req.ip

    try {

        let {email, password} = req.body
        
        
        // Validation
    
        if (!email || !password){
            logger.events("email and/or password missing from the body: POSTLogin", {userId, userIp})
            return CustomError(req, res, next)("Email and/or password missing from the body", HttpStatusCodes.BAD_REQUEST)
        }

        let validateResult: boolean | {error: string}

        validateResult = ValidateEmail(email)
        if (validateResult !== true){
            logger.events(`${validateResult.error}: POSTLogin`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
        }

        validateResult = ValidatePassword(password)
        if (validateResult !== true){
            logger.events(`${validateResult.error}: POSTLogin`, {userId, userIp})
            return CustomError(req, res, next)(validateResult.error,  HttpStatusCodes.BAD_REQUEST)
        }


    userId = (await db.LoginUser(email, password)).userId
    
    // If user doesn't exist
    if (!userId){
        logger.events("User failed to login: POSTLogin", {userId, userIp})
        return CustomError(req, res, next)("Incorrect email and/or password", HttpStatusCodes.UNAUTHORIZED)
    }

    // Login successful
    let token = CreateToken(userId)
    AddCookie(res, token)
    logger.events("User logged in successfully: POSTLogin", {userId, userIp})
    return res.send({status:"Logged in successfully.", url:"/"})
    }

    catch (error) {
        let error_ = error as Error
        return ControllerCatchError(req, res, next)(error_, `userAuth/${POSTLogin.name}()`, "fatal", {userId, userIp})
    }

}

export async function POSTSignUp(req: Request, res: Response, next: NextFunction){
    
    let userId: string | undefined = ""
    let userIp = req.ip!

   try {

    let {email, password, username} = req.body

    // Validation

    if (!email || !password || !username){
        logger.events("email and/or username and/or password missing from the body: POSTLogin", {userId, userIp})
        return CustomError(req, res, next)("Email and/or username and/or password missing from the body", HttpStatusCodes.BAD_REQUEST)
    }

    let validateResult: boolean | {error: string}

    validateResult = ValidateUsername(username)
    if (validateResult !== true){
        logger.events(`${validateResult.error}: POSTSignUp`, {userId, userIp})
        return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
    }

    validateResult = ValidateEmail(email)
    if (validateResult !== true){
        logger.events(`${validateResult.error}: POSTSignUp`, {userId, userIp})
        return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
    }

    validateResult = ValidatePassword(password)
    if (validateResult !== true){
        logger.events(`${validateResult.error}: POSTSignUp`, {userId, userIp})
        return CustomError(req, res, next)(validateResult.error, HttpStatusCodes.BAD_REQUEST)
    }

    userId = (await db.CheckIfUserExists(email)).userId

    if (userId){
        logger.events("Account already in use: POSTSignUp", {userId, userIp, email})
        return CustomError(req, res, next)("Account with this email already exists", HttpStatusCodes.CONFLICT)
    }

    // Signing user up

    userId = (await db.SignupUser(email, password, username)).userId
    let token = CreateToken(userId!)

    AddCookie(res, token)
    logger.events("User signup successfully: POSTSignUp", {userId, userIp})
    return res.send({status:"Signed up successfully", url:"/"})

   } catch (error) {
    let error_ = error as Error
    return ControllerCatchError(req, res, next)(error_, `userAuth/${POSTSignUp.name}()`, "fatal", {userId, userIp})
   }
}


export function GETLoginPage(req: Request, res: Response, next: NextFunction){
    return res.sendFile(LOGIN_PAGE_PATH)
}

export function GETSignupPage(req: Request, res: Response, next: NextFunction){
    return res.sendFile(SIGNUP_PAGE_PATH)
}

export function GETLogoutUser(req: Request, res: Response, next: NextFunction){
    return res.cookie("sessionToken", "", {httpOnly: true}).redirect("/user/login")
    
}


// Helper Functions

function AddCookie(res: Response, token: string){
    const options = {
        maxAge: eval(env("COOKIE_MAX_AGE")!),
        httpOnly: true
    }
    return res.cookie("sessionToken", token, options)
}


// Testing Purposes

export let exportFunctionsForTesting = {
    AddCookie
}