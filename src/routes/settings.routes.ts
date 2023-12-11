import express from "express"
import multerSettings from "@config/multerImageUploadSettings"

let router = express.Router()

import { GETSettings, POSTUpdateEmail, POSTUpdatePassword, POSTUpdateUsername, POSTUpdateProfilePic} from "@controllers/settings"

router.get("/", GETSettings)

router.post("/update-username", POSTUpdateUsername)
router.post("/update-email", POSTUpdateEmail)
router.post("/update-password", POSTUpdatePassword)


router.post("/update-profile-pic", multerSettings, POSTUpdateProfilePic)

export default router