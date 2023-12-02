//Function: 
//Integration tests for settings page. Testing API endpoints

import { describe, it, expect, beforeAll } from "vitest"

import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import MakeRequest from "@utils/makeRequests";

const updateEmailURL = "http://localhost:3000/settings/update-email"
const updatePasswordURL = "http://localhost:3000/settings/update-password"
const updateUsernameURL = "http://localhost:3000/settings/update-username"
const loginUrl = "http://localhost:3000/user/login"

let cookie: string

// dummy account
const email = "abc@gmail.com"
const password = "123456"


beforeAll(async () => {
    let response = await MakeRequest(loginUrl, "POST", {email, password})
    cookie = response.headers.getSetCookie()[0]!

    //sessionToken='insert jwtToken'
    cookie = cookie.split(";")[0]!
})

describe("/settings/ INTEGRATION TEST", () => {

    describe("POSTUpdateEmail", () => {

        it("should return BAD_REQUEST if paramaters are missing from the body", async () => {

            let response, statusCode, body, error, newEmail

            // Scenario 1: No email
            
            response = await MakeRequest(updateEmailURL,"POST", {password}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("'newEmail' missing from the body")


            // Scenario 2: No password
            
            newEmail = "bbbbbbbbbbbb@gmail.com"

            response = await MakeRequest(updateEmailURL,"POST", {newEmail}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("'passsword' missing from the body")

        })

        it("should return BAD_REQUEST if invalid email format is used", async () => {

            let newEmail = "abc"

            let response = await MakeRequest(updateEmailURL,"POST", {newEmail, password}, cookie)

            let statusCode = response.status
            let body = await response.json() as {error: string} 
            let error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Incorrect email format")

        })

        it("should return BAD_REQUEST if invalid password format is used", async () => {

            let newEmail = "bbbbbbbbbbbb@gmail.com"

            // Passwords must be atleast 6 characters long and a string
            let password = "123"

            let response = await MakeRequest(updateEmailURL,"POST", {newEmail, password}, cookie)

            let statusCode = response.status
            let body = await response.json() as {error: string} 
            let error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Password must be atleast 6 characters long")

        })

        it("should return UNAUTHORIZED if incorrect password is used", async () => {

            let newEmail = "abcd@gmail.com"
            
            // Passwords must be atleast 6 characters long and a string
            let password = "99999999999999999"

            let response = await MakeRequest(updateEmailURL,"POST", {newEmail, password}, cookie)

            let statusCode = response.status
            let body = await response.json() as {error: string} 
            let error = body.error

            expect(statusCode).toBe(HttpStatusCodes.UNAUTHORIZED)
            expect(error).toBe("Incorrect password")

        })

        it.skip("should update email successfully if correct password used", async () => {

            let newEmail = "bbbbbbbbbbbb@gmail.com"
            
            let response = await MakeRequest(updateEmailURL,"POST", {newEmail, password}, cookie)

            let statusCode = response.status
            let body = await response.json() as {status: string} 
            let status = body.status

            expect(statusCode).toBe(HttpStatusCodes.OK)
            expect(status).toBe("Email updated successfully")

            // Change email back to original
            await MakeRequest(updateEmailURL,"POST", {newEmail: email, password}, cookie)

        })

    })

    describe("POSTUpdatePassword", () => {

        it("should return BAD_REQUEST if paramaters are missing from the body", async () => {

            let response, statusCode, body, error

            // Scenario 1: No currentPassword
            
            let newPassword = "123"

            response = await MakeRequest(updatePasswordURL,"POST", {newPassword}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("'currentPassword' missing from the body")


            // Scenario 2: No newPassword
            
            let currentPassword = password

            response = await MakeRequest(updatePasswordURL,"POST", {currentPassword}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("'newPassword' missing from the body")

        })

        it("should return BAD_REQUEST if invalid currentPassword and/or newPassword are used", async () => {

            let response, statusCode, body, error, currentPassword, newPassword

            // currentPassword must be atleast 6 characters long and a string
            currentPassword = "abc"
            newPassword = "123456"

            response = await MakeRequest(updatePasswordURL,"POST", {currentPassword,newPassword}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Password must be atleast 6 characters long")


            // newPassword must be atleast 6 characters long and a string
            currentPassword = "123456"
            newPassword = "abc"

            response = await MakeRequest(updatePasswordURL,"POST", {currentPassword,newPassword}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Password must be atleast 6 characters long")

        })

        it("should return UNAUTHORIZED if incorrect password is used", async () => {

            let currentPassword = "9999999999999999999"
            let newPassword = "1234698989"

            let response = await MakeRequest(updatePasswordURL,"POST", {currentPassword, newPassword}, cookie)

            let statusCode = response.status
            let body = await response.json() as {error: string} 
            let error = body.error

            expect(statusCode).toBe(HttpStatusCodes.UNAUTHORIZED)
            expect(error).toBe("Incorrect password")

        })

        it.skip("should update password successfully if correct parameters used", async () => {

            let currentPassword = password
            let newPassword = "1234567"
            
            let response = await MakeRequest(updatePasswordURL,"POST", {currentPassword, newPassword}, cookie)

            let statusCode = response.status
            let body = await response.json() as {status: string} 
            let status = body.status

            expect(statusCode).toBe(HttpStatusCodes.OK)
            expect(status).toBe("Password updated successfully")


            // Change password back to original
            await MakeRequest(updatePasswordURL,"POST", {currentPassword: newPassword, newPassword: password}, cookie)

        })

    })

    describe("POSTUpdateUsername", () => {

        it("should return BAD_REQUEST if invalid username is used", async () => {
        
            let newUsername, response, statusCode, body, error

            // Scenario 1 : newUsername must be between 3 and 20 characters long

            newUsername = "a"

            response = await MakeRequest(updateUsernameURL,"POST", {newUsername}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Username must be between 3 and 20 characters")


            // Scenario 2 : newUsername must not include special characters (with the exception of _)

            newUsername = "a#28**-=2"

            response = await MakeRequest(updateUsernameURL,"POST", {newUsername}, cookie)

            statusCode = response.status
            body = await response.json() as {error: string} 
            error = body.error

            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Only characters from A-Z, a-z, numbers, and underscores are allowed.")

        })

        it("should update username successfully if valid username is used", async () => {

            let newUsername = "hello_there"
            
            let response = await MakeRequest(updateUsernameURL,"POST", {newUsername}, cookie)

            let statusCode = response.status
            let body = await response.json() as {status: string} 
            let status = body.status

            expect(statusCode).toBe(HttpStatusCodes.OK)
            expect(status).toBe("Username updated successfully")

        })

    })

})

