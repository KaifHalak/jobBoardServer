import express from "express"

let router = express.Router()

import { GETCreateJobPostPage, POSTCreateJobPost } from "@controllers/createJobPost"
router.get("/create", GETCreateJobPostPage)
router.post("/create", POSTCreateJobPost)

import { GETSavedJobsPage, POSTSaveJob, POSTUnSaveJob } from "@controllers/savedJobs";
router.get("/saved", GETSavedJobsPage)
router.post("/save", POSTSaveJob)
router.post("/unsave", POSTUnSaveJob)

import { GETYourJobsPage, POSTDeleteJob, POSTGetMoreYourJobs } from "@controllers/yourJobs"
router.get("/created",GETYourJobsPage)
router.post("/delete",POSTDeleteJob)
router.post("/created",POSTGetMoreYourJobs)


import GETViewJob from "@controllers/viewJobs"
router.get("/:id", GETViewJob)


export default router