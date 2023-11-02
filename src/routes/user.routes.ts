import express from "express"
let router = express.Router()

import { Login, SignUp } from "@controllers/userAuthController";
router.post("/login", Login)
router.post("/signup",SignUp)

export default router