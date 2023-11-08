import { Request, Response, NextFunction } from "express"
import path from "path"

const FILE_PATH = path.join(__dirname, "../", "../", "client", "public", "mainUI", "index.html")

export default function MainPage(req: Request, res: Response, next: NextFunction){
    res.sendFile(FILE_PATH)
}