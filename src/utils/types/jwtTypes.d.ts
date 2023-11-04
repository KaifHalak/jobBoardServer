import jwt from "jsonwebtoken"

export namespace interfaceJWT{
    
    interface payload{
        userId?: string
    }

    interface extendedPayload extends jwt.JwtPayload{
        userId?: string
    }

}