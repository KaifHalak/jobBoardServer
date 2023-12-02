import jwt from "jsonwebtoken"
import env from "../env"
import { interfaceJWT } from "../types/authTypes"

export function CreateToken(userId: string){
    let token = jwt.sign({ userId }, env("JWT_SECRET")!, { expiresIn: "50m"})
    return token
}

export function VerifyToken(token: string){
    try {
        let payload = jwt.verify(token, env("JWT_SECRET")!) as interfaceJWT.extendedPayload
        return payload
    } catch (error) {
        return null
    }
}


