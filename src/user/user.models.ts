export class NewUserFromJsonError extends Error {
    constructor() {
        super("Failed to parse JSON into NewUser")
    }
}

export class NewUser {
    public email: string
    public username: string
    public password: string

    constructor(email: string, username: string, password: string) {
        this.email = email
        this.username = username
        this.password = password
    }

    public static fromJson(json: unknown): NewUserFromJsonError | NewUser {
        if (!json || typeof json !== "object") {
            return new NewUserFromJsonError()
        }

        if (!("email" in json) || typeof json.email !== "string") {
            return new NewUserFromJsonError()
        }
        if (!("username" in json) || typeof json.username !== "string") {
            return new NewUserFromJsonError()
        }
        if (!("password" in json) || typeof json.password !== "string") {
            return new NewUserFromJsonError()
        }

        return new NewUser(json.email, json.username, json.password)
    }
}
