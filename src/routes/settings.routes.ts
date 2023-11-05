import express from "express"
import path from "path"

let router = express.Router()

import { PostUpdateUsername } from "@controllers/postUpdateUsernameController"
router.post("/update-username", PostUpdateUsername)

import { PostUpdateEmail } from "@controllers/postUpdateEmailController"
router.post("/update-email", PostUpdateEmail)

import { PostUpdatePassword } from "@controllers/postUpdatePassword"
router.post("/update-password", PostUpdatePassword)

import { GetSettings } from "@controllers/getSettingsController"
router.get("/", GetSettings)



export default router