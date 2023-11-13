import express from "express"
import path from "path"

let router = express.Router()

import { GETSettings, POSTUpdateEmail, POSTUpdatePassword, POSTUpdateUsername} from "@controllers/settings"

router.get("/", GETSettings)

router.post("/update-username", POSTUpdateUsername)
router.post("/update-email", POSTUpdateEmail)
router.post("/update-password", POSTUpdatePassword)


export default router