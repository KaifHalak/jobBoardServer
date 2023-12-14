import jwt from "jsonwebtoken"
import env from "@utils/env"
import { ExtendedPayload } from "@utils/interfaces/authTypes"

export function CreateToken(userId: string){
    let token = jwt.sign({ userId }, env("JWT_SECRET")!, { expiresIn: "50m"})
    return token
}

export function VerifyToken(token: string){
    try {
        let payload = jwt.verify(token, env("JWT_SECRET")!) as ExtendedPayload
        return payload
    } catch (error) {
        return null
    }
}


