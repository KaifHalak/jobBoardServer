import jwt from "jsonwebtoken"

export namespace interfaceJWT{

    interface payload extends jwt.JwtPayload{
        userId?: string
    }

}