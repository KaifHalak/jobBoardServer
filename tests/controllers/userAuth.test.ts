//Function: 
//Integration tests for userAuth. Testing API endpoints

import { describe, it, expect } from "vitest"

import HttpStatusCodes from "@utils/enums/httpStatusCodes";
import MakeRequest from "@utils/makeRequests";

const loginUrl = "http://localhost:3000/user/login"
const signupUrl = "http://localhost:3000/user/signup"

describe("/user/ INTEGRATION TEST", () => {

    describe("Login", () => {

        it("should return BAD_REQUEST when paramters are missing from the body", async () => {
            
            let response = await MakeRequest(loginUrl, "POST", {})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Email and/or password missing from the body")

        })

        it("should return BAD_REQUEST when an invalid email is used", async () => {

            let email = "Hello"
            let password = "1234567"
            
            let response = await MakeRequest(loginUrl, "POST", {email, password})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Invalid email format")

        })

        it("should return BAD_REQUEST when an invalid password is used", async () => {

            let email = "Hello@gmail.com"
            let password = 1234567  // password must be atleast 6 characters long and must be a string
            
            let response = await MakeRequest(loginUrl, "POST", {email, password})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Password must be atleast 6 characters long")

        })

        it("should return UNAUTHORIZED when user doesnt exist (invalid email and password)", async () => {

            let email = "Hello22222222222@gmail.com"
            let password = "1234567"
            
            let response = await MakeRequest(loginUrl, "POST", {email, password})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.UNAUTHORIZED)
            expect(error).toBe("Incorrect email and/or password")

        })

        // Uncomment line 53 from src/utils/database.ts to use this test
        it.skip("should return SERVER_ERROR when there is a server error", async () => {

            let email = "abc@gmail.com"
            let password = "123456"
            
            let response = await MakeRequest(loginUrl, "POST", {email, password})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error

            expect(error).toBe("Server error. Please try again later")
            expect(statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR)

        })

        it("should login successfully if user exists", async () => {

            let email = "abc@gmail.com"
            let password = "123456"
            
            let response = await MakeRequest(loginUrl, "POST", {email, password})

            let statusCode = response.status
            let cookie = response.headers.getSetCookie()[0]
            let body = await response.json() as {status: string, url:"/"}
            let status = body.status
            let url = body.url
            
            expect(statusCode).toBe(HttpStatusCodes.OK)
            expect(status).toBe("Logged in successfully.")
            expect(cookie).toBeTruthy()
            expect(url).toBe("/")

        })

    })

    describe("Signup", () => {

        it("should return BAD_REQUEST when paramters are missing from the body", async () => {
            
            let response = await MakeRequest(signupUrl, "POST", {})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Email and/or username and/or password missing from the body")

        })

        it("should return BAD_REQUEST when an invalid username is used", async () => {
            
            let username = "@&Hello"
            let email = "Hello@gmail.com"
            let password = "1234567"
            
            // Response 1 - Check for special characters

            let response = await MakeRequest(signupUrl, "POST", {email, password, username})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Only characters from A-Z, a-z, numbers, and underscores are allowed.")

            // Response 2 - Check for length

            username = "ab"
            
             response = await MakeRequest(signupUrl, "POST", {email, password, username})



            statusCode = response.status
            body = await response.json() as {error: string}
            error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Username must be between 3 and 20 characters")

        })

        it("should return BAD_REQUEST when an invalid email is used", async () => {

            let username = "hello_"
            let email = "Hello"
            let password = "1234567"
            
            let response = await MakeRequest(signupUrl, "POST", {email, password,username})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Invalid email format")

        })

        it("should return BAD_REQUEST when an invalid password is used", async () => {

            let username = "_hello"
            let email = "Hello@gmail.com"
            let password = 1234567  // password must be atleast 6 characters long and must be a string
            
            let response = await MakeRequest(signupUrl, "POST", {email, password, username})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
            expect(error).toBe("Password must be atleast 6 characters long")

        })

        it("should return CONFLICT if the account already exists", async () => {

            let username = "_hello"
            let email = "abc@gmail.com"
            let password = "123456"
            
            let response = await MakeRequest(signupUrl, "POST", {email, password, username})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error
            
            expect(statusCode).toBe(HttpStatusCodes.CONFLICT)
            expect(error).toBe("Account with this email already exists")

        })

        // Uncomment line 37 from src/utils/database.ts to use this test
        it.skip("should return SERVER_ERROR when there is a server error", async () => {

            let username = "hello__"
            let email = "99999999999999999999999@gmail.com"
            let password = "123456"
            
            let response = await MakeRequest(signupUrl, "POST", {email, password, username})

            let statusCode = response.status
            let body = await response.json() as {error: string}
            let error = body.error

            expect(error).toBe("Server error. Please try again later")
            expect(statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR)

        })

        // Change email to create a new account
        it.skip("should signup successfully is user doesnt exist", async () => {

            let username = "abc"
            let email = "abcd@gmail.com"
            let password = "123456"
            
            let response = await MakeRequest(signupUrl, "POST", {email, password, username})

            let statusCode = response.status
            let cookie = response.headers.getSetCookie()[0]

            let body = await response.json() as {status: string, url:"/"}
            let status = body.status
            let url = body.url
            
            expect(statusCode).toBe(HttpStatusCodes.OK)
            expect(status).toBe("Signed up successfully")
            expect(cookie).toBeTruthy()
            expect(url).toBe("/")

        })

    })

})

