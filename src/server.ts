import app from "./config/serverSettings";



import MainPage from "@controllers/mainPage";
app.get("/", MainPage)

import User from "@routes/user.routes"
app.use("/user", User)

import VerifyJWTToken from "@middlewares/verifyJWTToken";
app.use("/", VerifyJWTToken)

import Settings from "@routes/settings.routes"
app.use("/settings", Settings)

import Jobs from "@routes/jobs.routes"
app.use("/jobs", Jobs)


