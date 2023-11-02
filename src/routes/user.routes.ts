import express from "express"
import path from "path"

let router = express.Router()

import { Login, SignUp } from "@controllers/userAuthController";
router.post("/login", Login)
router.post("/signup",SignUp)

const loginPage = path.join(__dirname, "../", "../", "../", "client", "public", "loginUI", "index.html")
const signupPage = path.join(__dirname, "../", "../", "../", "client", "public", "signupUI", "index.html")

router.get("/login", (req, res, next) => {
    res.sendFile(loginPage)
})
router.get("/signup", (req, res, next) => {
    res.sendFile(signupPage)
})

export default router