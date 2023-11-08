import { Request, Response, NextFunction } from "express"

import { CreateToken } from "@utils/security/jwtToken";
import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import {  ServerError, CustomError } from "@middlewares/globalErrorHandling";

import env from "@utils/env";
import db from "@utils/database";
import path from "path"

// Function:
// Process Login and SignUp Requests

const LOGIN_PAGE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "loginUI", "index.html")
const SIGNUP_PAGE_PATH = path.join(__dirname, "../", "../", "../", "client", "public", "signupUI", "index.html")


export async function POSTLogin(req:Request, res: Response, next: NextFunction){
    try {

        let {email, password} = req.body

        // Validation
    
        if (!ValidateEmail(email)){
            return CustomError(req, res, next)("Invalid email format", HttpStatusCodes.BAD_REQUEST)
        }
    
        if (!ValidatePassword(password)){
            return CustomError(req, res, next)("Password must be atleast 6 characters long",  HttpStatusCodes.BAD_REQUEST)
        }

    let userId = await db.LoginUser(email, password)
    
    // If user doesn't exist
    if (!userId){
        return CustomError(req, res, next)("Incorrect email and/or password", HttpStatusCodes.UNAUTHORIZED)
    }

    let token = CreateToken(userId)
    AddCookie(res, token)
    return res.send({status:"Logged in successfully.", url:"/"})

    }

    catch (error) {
        console.log("Error logging in user:", error)
        return ServerError(req, res, next)()
    }

}

export async function POSTSignUp(req: Request, res: Response, next: NextFunction){
   try {

    let {email, password, username} = req.body

    // Validation

    if (!username){
        return CustomError(req, res, next)("Username must have a value", HttpStatusCodes.BAD_REQUEST)
    }

    if (!ValidateEmail(email)){
        return CustomError(req, res, next)("Invalid email format", HttpStatusCodes.BAD_REQUEST)
    }

    if ( !ValidatePassword(password)){
        return CustomError(req, res, next)(`Password must be atleast 6 characters long`,HttpStatusCodes.BAD_REQUEST)
    }

    let userId = await db.CheckIfUserExists(email)

    if (userId){
        return CustomError(req, res, next)("Account with this email already exists", HttpStatusCodes.CONFLICT)
    }

    // Signing user up

    userId = await db.SignupUser(email, password, username) as string
    let token = CreateToken(userId)

    AddCookie(res, token)
    return res.send({status:"Signed up successfully", url:"/"})

   } catch (error) {
    console.log("Error sigining up user:", error)
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

function AddCookie(res: Response, token: string){
    const options = {
        maxAge: eval(env("COOKIE_MAX_AGE")!),
        httpOnly: true
    }
    return res.cookie("sessionToken", token, options)
}