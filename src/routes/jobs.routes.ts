import express from "express"

let router = express.Router()

import { GETCreateJobPostPage, POSTCreateJobPost } from "@controllers/createJobPost"
router.get("/create", GETCreateJobPostPage)
router.post("/create", POSTCreateJobPost)

export default router