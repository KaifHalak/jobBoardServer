import { Request ,Response, NextFunction } from "express"
import path from "path"

// Function:
// View page not found 

const FILE_PATH = path.join(__dirname, "../", "../", "../", "jobBoardClient", "public", "pageNotFoundUI", "index.html")

export default async function GETPageNotFound(req: Request, res: Response, next: NextFunction){
    res.status(404).sendFile(FILE_PATH)
}