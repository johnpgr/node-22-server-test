import type { HttpRequest, HttpResponse } from "uWebSockets.js"
import { HttpStatus, readJsonBody } from "../utils.ts"
import { NewUser, NewUserFromJsonError } from "./user.models.ts"
import {
    insertNewUser,
    InsertNewUserError,
    makeUserSession,
    MakeUserSessionError,
} from "./user.service.ts"

export async function handleCreateUser(res: HttpResponse, _req: HttpRequest) {
    const input = await readJsonBody(res)

    const newUser = NewUser.fromJson(input)
    if (newUser instanceof NewUserFromJsonError) {
        res.writeStatus(HttpStatus.BadRequest)
        res.end()
        return
    }

    const inserted = await insertNewUser(newUser)
    if (inserted instanceof InsertNewUserError) {
        switch (inserted.kind) {
            case "ConflictingData": {
                res.writeStatus(HttpStatus.Conflict)
                res.end()
                return
            }
            case "InvalidData": {
                res.writeStatus(HttpStatus.BadRequest)
                res.end()
                return
            }
            case "Unknown": {
                res.writeStatus(HttpStatus.InternalServerError)
                res.end()
                return
            }
        }
    }

    const session = await makeUserSession(inserted)
    if (session instanceof MakeUserSessionError) {
        res.writeStatus(HttpStatus.InternalServerError)
        res.end()
        return
    }

    res.writeStatus(HttpStatus.Created)
    res.writeHeader("Content-Type", "application/json")
    res.end(
        JSON.stringify({
            id: inserted.id,
            username: inserted.username,
            email: newUser.email,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        }),
    )
}
