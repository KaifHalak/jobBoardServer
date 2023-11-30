//Function: 
//Unit tests for validators

import { describe, it, expect } from "vitest"
import * as validators from "@utils/validators"

describe("utils/validators", () => {

    describe("Validate Email", () => {

        let validateEmailFunction = validators.ValidateEmail
        
        it("should reject invalid email", () => {
            
            let testCases = ["abc123", "abc@something", "abc123@", "@domain.com", ".com", ""]

            testCases.forEach((email) => {
                let outcome = validateEmailFunction(email)
                expect(outcome).toBeFalsy()
            })

        })

        it("should accept valid email", () => {

            let testCases = ["abc@gmail.com", "b@hotmail.ca", "abc123@outlook.my", "user@domain.verylongtld", "user.filter@gmail.com", "user@sub.domain.com", "user@my-domain.com", "user+tag@domain.com"]

            testCases.forEach((email) => {
                let outcome = validateEmailFunction(email)
                expect(outcome).toBeTruthy()
            })

        })

    })

    describe("Validate Password", () => {
        // Must be atleast 6 characters long

        let validatePasswordFunction = validators.ValidatePassword

        it("should reject invalid password", () => {

            let testCases = ["124", "abcde", "12sde"]

            testCases.forEach((password) => {
                let outcome = validatePasswordFunction(password)
                expect(outcome).toBeFalsy()
            })

        })

        it("should accept valid password", () => {

            let testCases = ["123456", "abcdef", "12sde108dwf"]

            testCases.forEach((password) => {
                let outcome = validatePasswordFunction(password)
                expect(outcome).toBeTruthy()
            })

        })

    })

    describe("Validate Username", () => {

        let validateUsernameFunction = validators.ValidateUsername

        it("should reject invalid username", () => {

            // Validate username length

            let testCases = ["us", "12", "a1","wefwefwejoiewjfioweiewfjwefjjwejfi","      us"]
            testCases.forEach((username) => {
                let outcome = validateUsernameFunction(username)
                expect(outcome).toStrictEqual({error : "Username must be between 3 and 20 characters"})
            })

            // Check for special charactersa and space

            testCases = ["usman@", "!@#$%^&*)(-+=[]{}'", ";:.>,</?", "u$man","u       s"]
            testCases.forEach((username) => {
                let outcome = validateUsernameFunction(username)
                expect(outcome).toStrictEqual({error: "Only characters from A-Z, a-z, numbers, and underscores are allowed."})
            })

        })

        it("should accept valid username", () => {

            let testCases = ["usman", "123456", "123", "usm", "u2s", "___", "us__"]
            testCases.forEach((username) => {
                let outcome = validateUsernameFunction(username)
                expect(outcome).toBeTruthy()
            })

        })

    })
    
})
