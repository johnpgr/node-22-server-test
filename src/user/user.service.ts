import { eq, or } from "drizzle-orm"
import { db } from "../../drizzle/client.ts"
import { Session, User } from "../../drizzle/schema.ts"
import { NewUser } from "./user.models.ts"
import * as argon2 from "@node-rs/argon2"
import { generateToken, GenerateTokenError } from "../utils.ts"

export const UserCreateErrorKind = [
    "ConflictingData",
    "InvalidData",
    "Unknown",
] as const
export type UserCreateErrorKind = (typeof UserCreateErrorKind)[number]

export class InsertNewUserError extends Error {
    public kind: UserCreateErrorKind = "Unknown"
    constructor(kind: UserCreateErrorKind) {
        super("Failed to insert user. Error code: " + kind)
        this.kind = kind
    }
}

export async function insertNewUser(
    user: NewUser,
): Promise<InsertNewUserError | User> {
    const existingUser = await db.query.User.findFirst({
        where: ({ username, email }) =>
            or(eq(username, user.username), eq(email, user.email)),
    })

    if (existingUser) {
        return new InsertNewUserError("ConflictingData")
    }

    const [newUser] = await db
        .insert(User)
        .values({
            email: user.email,
            username: user.username,
            passwordHash: await argon2.hash(user.password),
        })
        .returning()

    if (!newUser) {
        return new InsertNewUserError("InvalidData")
    }


    return newUser
}

export type MakeUserSession = { accessToken: string, refreshToken: string }
export class MakeUserSessionError extends Error {
    constructor(){
        super("Failed to make user session")
    }
}
export async function makeUserSession(user: User): Promise<MakeUserSessionError | MakeUserSession> {
    const tokenPayload = { userId: user.id }

    const accessToken = await generateToken(tokenPayload, "30m")
    if (accessToken instanceof GenerateTokenError) {
        return new MakeUserSessionError()
    }

    const refreshToken = await generateToken(tokenPayload, "7d")
    if (refreshToken instanceof GenerateTokenError) {
        return new MakeUserSessionError()
    }

    await db.insert(Session).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })

    return {
        accessToken,
        refreshToken,
    }
}

