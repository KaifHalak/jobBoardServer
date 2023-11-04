import express from "express"
import path from "path"

let router = express.Router()

import { PostUpdateUsername } from "@controllers/postUpdateUsernameController"
router.post("/update-username", PostUpdateUsername)

import { GetSettings } from "@controllers/getSettingsController"
router.get("/", GetSettings)



export default router