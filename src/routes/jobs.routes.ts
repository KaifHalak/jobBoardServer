import express from "express"
import path from "path"

let router = express.Router()

import { GetJobPost } from "@controllers/getJobPostController"
router.get("/post", GetJobPost)

import { PostJobPost } from "@controllers/postJobPostController"
router.post("/post", PostJobPost)

export default router