import app from "./config/serverSettings";



import { MainPage,  POSTMoreJobs } from "@controllers/mainPage";
app.get("/", MainPage)
app.post("/", POSTMoreJobs)

import User from "@routes/user.routes"
app.use("/user", User)

import VerifyJWTToken from "@middlewares/verifyJWTToken";
app.use("/", VerifyJWTToken)

import Settings from "@routes/settings.routes"
app.use("/settings", Settings)

import Jobs from "@routes/jobs.routes"
app.use("/jobs", Jobs)


