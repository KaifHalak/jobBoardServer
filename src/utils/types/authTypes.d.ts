import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

export namespace interfaceJWT{
    
    interface extendedPayload extends JwtPayload{
        userId?: string
    }

}

export namespace interfaceExpress {

    interface customRequest extends Request {
        userId?: string
    }

}