import app from "./config/serverSettings";
import path from "path"

import User from "@routes/user.routes"
app.use("/user", User)




