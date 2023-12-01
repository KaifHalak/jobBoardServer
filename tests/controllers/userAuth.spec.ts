//Function: 
//Unit tests for userAuth

import { Response } from "express"

import { describe, it, expect } from "vitest"
import { exportFunctionsForTesting } from "@controllers/userAuth"
import env from "@utils/env";


describe("controllers/userAuth UNIT TESTS", () => {

    describe("Validate AddCookie", () => {
        
        let addCookieFunction = exportFunctionsForTesting.AddCookie

        it("should add cookie with correct options", () => {

            let responseFunction = {
                cookieName: "",
                cookieValue: "",
                options: {},
            
                cookie: function(cookieName: string, cookieValue: string, options: Record<string, any>) {
                    this.cookieName = cookieName;
                    this.cookieValue = cookieValue;
                    this.options = options;
                }
            }

            let token = "randomToken"

            addCookieFunction(responseFunction as unknown as Response, token)
            
            let cookieName = responseFunction.cookieName
            let cookieValue = responseFunction.cookieValue
            let options = responseFunction.options

            expect(cookieName).toBe("sessionToken")
            expect(cookieValue, token)
            expect(options).toStrictEqual({
                maxAge: eval(env("COOKIE_MAX_AGE")!),
                httpOnly: true
            })

        })

    })

})