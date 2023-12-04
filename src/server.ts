import app from "./config/serverSettings";

import { GETMainPage,  POSTGetMoreJobs } from "@controllers/mainPage";
app.get("/", GETMainPage)
app.post("/", POSTGetMoreJobs)

import User from "@routes/user.routes"
app.use("/user", User)

import VerifyJWTToken from "@middlewares/verifyJWTToken";
app.use("/", VerifyJWTToken)

import Settings from "@routes/settings.routes"
app.use("/settings", Settings)

import Jobs from "@routes/jobs.routes"
app.use("/jobs", Jobs)

import { GETPageNotFound } from "@controllers/pageNotFound";
app.use("/", GETPageNotFound)


