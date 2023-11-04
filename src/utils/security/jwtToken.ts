import jwt from "jsonwebtoken"
import env from "../env"
import { interfaceJWT } from "../types/jwtTypes"

export function CreateToken(payload: interfaceJWT.payload){
    let token = jwt.sign(payload, env("JWT_SECRET")!, { expiresIn: "15m" })
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


