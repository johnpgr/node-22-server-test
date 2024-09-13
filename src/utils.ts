import type { HttpResponse } from "uWebSockets.js"
import { type JWTPayload, SignJWT } from "jose"
import { JWT_SECRET } from "../config/consts.ts"

const jwtSecret = new TextEncoder().encode(JWT_SECRET)

export class ReadJsonBodyError extends Error {
    constructor() {
        super("Failed to read JSON body")
    }
}

export async function readJsonBody<Data = unknown>(
    res: HttpResponse,
): Promise<ReadJsonBodyError | Data> {
    let buffer = Buffer.alloc(0)
    let error: ReadJsonBodyError | undefined
    let data: Data | undefined

    res.onData((chunk, isLast) => {
        buffer = Buffer.concat([buffer, Buffer.from(chunk)])
        if (!isLast) {
            if (buffer) {
                //@ts-expect-error this is ok
                buffer = Buffer.concat([buffer, chunk])
            } else {
                buffer = Buffer.concat([buffer])
            }
            error = new ReadJsonBodyError()
            return
        }
        if (buffer) {
            try {
                //@ts-expect-error this is ok
                data = JSON.parse(Buffer.concat([buffer, chunk]).toString())
            } catch (error) {
                res.close()
                error = new ReadJsonBodyError()
            }
        }
    })

    return error ?? data!
}


export class GenerateTokenError extends Error {
    constructor() {
        super("Failed to generate token")
    }
}

export async function generateToken(
    payload: JWTPayload,
    expiration: string,
): Promise<GenerateTokenError | string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiration)
        .sign(jwtSecret)
}

export const HttpStatus = {
    OK: "200 OK",
    Created: "201 Created",
    NoContent: "204 No Content",
    BadRequest: "400 Bad Request",
    Unauthorized: "401 Unauthorized",
    Forbidden: "403 Forbidden",
    NotFound: "404 Not Found",
    Conflict: "409 Conflict",
    InternalServerError: "500 Internal Server Error",
    BadGateway: "502 Bad Gateway",
    ServiceUnavailable: "503 Service Unavailable",
    GatewayTimeout: "504 Gateway Timeout",
} as const
