import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

export interface ExtendedPayload extends JwtPayload{
    userId?: string
}

export interface CustomRequest extends Request {
    userId?: string
}
