import express from "express"

let router = express.Router()

import { POSTLogin, POSTSignUp, GETLoginPage, GETSignupPage } from "@controllers/userAuth";
router.post("/login", POSTLogin)
router.post("/signup",POSTSignUp)

router.get("/login", GETLoginPage)
router.get("/signup", GETSignupPage)

export default router