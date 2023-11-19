import { Request, Response, NextFunction } from "express"
import path from "path"

import { CreateToken } from "@utils/security/jwtToken";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import {  ServerError, CustomError } from "@middlewares/globalErrorHandling";
import env from "@utils/env";
import db from "@utils/database";
import logger from "@utils/logger/dataLogger";

// Function:
// Process Login and SignUp Requests

const LOGIN_PAGE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "loginUI", "index.html")
const SIGNUP_PAGE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "signupUI", "index.html")


export async function POSTLogin(req:Request, res: Response, next: NextFunction){
    
    let userId
    let userIp = req.ip

    try {

        let {email, password} = req.body

        // Validation
    
        if (!ValidateEmail(email)){
            logger.Events("Invalid email: POSTLogin", {userId, userIp})
            return CustomError(req, res, next)("Invalid email format", HttpStatusCodes.BAD_REQUEST)
        }
    
        if (!ValidatePassword(password)){
            logger.Events("Invalid password: POSTLogin", {userId, userIp})
            return CustomError(req, res, next)("Password must be atleast 6 characters long",  HttpStatusCodes.BAD_REQUEST)
        }

    userId = await db.LoginUser(email, password)
    
    // If user doesn't exist
    if (!userId){
        logger.Events("User failed to login: POSTLogin", {userId, userIp})
        return CustomError(req, res, next)("Incorrect email and/or password", HttpStatusCodes.UNAUTHORIZED)
    }

    let token = CreateToken(userId)
    AddCookie(res, token)
    logger.Events("User logged in successfully: POSTLogin", {userId, userIp})
    return res.send({status:"Logged in successfully.", url:"/"})
    }

    catch (error) {
        let error_ = error as Error
        error_.message = "Error logging in user"
        logger.Events(error_, {userId, userIp})
        return ServerError(req, res, next)()
    }

}

export async function POSTSignUp(req: Request, res: Response, next: NextFunction){
    
    let userId
    let userIp = req.ip!

   try {

    let {email, password, username} = req.body

    // Validation

    let result = ValidateUsername(username)
    if (result?.error){
        logger.Events("Invalid username: POSTSignUp", {userId, userIp})
        return CustomError(req, res, next)(result.error, HttpStatusCodes.BAD_REQUEST)
    }

    if (!ValidateEmail(email)){
        logger.Events("Invalid email: POSTSignUp", {userId, userIp})
        return CustomError(req, res, next)("Invalid email format", HttpStatusCodes.BAD_REQUEST)
    }

    if (!ValidatePassword(password)){
        logger.Events("Invalid password: POSTSignUp", {userId, userIp})
        return CustomError(req, res, next)(`Password must be atleast 6 characters long`,HttpStatusCodes.BAD_REQUEST)
    }

    userId = await db.CheckIfUserExists(email)

    if (userId){
        logger.Events("Account already in use: POSTSignUp", {userId, userIp, email})
        return CustomError(req, res, next)("Account with this email already exists", HttpStatusCodes.CONFLICT)
    }

    // Signing user up

    userId = await db.SignupUser(email, password, username) as string
    let token = CreateToken(userId)

    AddCookie(res, token)
    logger.Events("User signup successfully: POSTSignUp", {userId, userIp})
    return res.send({status:"Signed up successfully", url:"/"})

   } catch (error) {
    let error_ = error as Error
    error_.message = "Error siging up user: POSTSignUp"
    logger.Events(error_, {userId, userIp})
    return ServerError(req, res, next)()
   }
}


export function GETLoginPage(req: Request, res: Response, next: NextFunction){
    return res.sendFile(LOGIN_PAGE_PATH)
}

export function GETSignupPage(req: Request, res: Response, next: NextFunction){
    return res.sendFile(SIGNUP_PAGE_PATH)
}


// Helper Functions

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

function ValidateUsername(username: string){

    let allowedPatterns = /^[a-zA-Z0-9_]+$/

    if ( !(username.length >= 3 && username.length <= 20) ){
        return {error : "Username must be between 3 and 20 characters"}
    }

    if ( !(allowedPatterns.test(username)) ){
        return {error: "Only characters from A-Z, a-z, numbers, and underscores are allowed."}
    }

    return

}

function AddCookie(res: Response, token: string){
    const options = {
        maxAge: eval(env("COOKIE_MAX_AGE")!),
        httpOnly: true
    }
    return res.cookie("sessionToken", token, options)
}