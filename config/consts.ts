const PORT = process.env.PORT!
const JWT_SECRET = process.env.JWT_SECRET!
const DB_URL = process.env.DB_URL!

if(!PORT) {
    throw new Error("PORT Not found!")
}

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET Not found!")
}

if(!DB_URL) {
    throw new Error("DB_URL Not found!")
}

export { JWT_SECRET, PORT, DB_URL }
