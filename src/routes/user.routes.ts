import express from "express"
import path from "path"

let router = express.Router()

import { PostLogin, PostSignUp } from "@controllers/postUserAuthController";
router.post("/login", PostLogin)
router.post("/signup",PostSignUp)

// If user has a valid JWT token, redirect them to the main page
import { VerifyJWTToken } from "@middlewares/verifyJWTToken";
router.use("/", VerifyJWTToken)

import { GetLogin, GetSignup } from "@controllers/getUserAuthController";
router.get("/login", GetLogin)
router.get("/signup", GetSignup)

export default router