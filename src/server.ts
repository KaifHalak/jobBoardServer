import app from "./config/serverSettings";
import path from "path"
import { Request, Response, NextFunction } from "express"


import User from "@routes/user.routes"
app.use("/user", User)

import Settings from "@routes/settings.routes"
app.use("/settings", Settings)

// Default route

const defaultPage = path.join(__dirname, "../", "../", "client", "public", "mainUI", "index.html")
    
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(defaultPage)
})




