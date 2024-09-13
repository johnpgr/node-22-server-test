import { HttpStatus } from "./utils.ts"
import { PORT } from "../config/consts.ts"
import { handleCreateUser } from "./user/user.controller.ts"
import { App } from "uWebSockets.js";

const app = App();

app.listen(parseInt(PORT), (socket) => {
    if (socket) {
        console.log(`App running in http://0.0.0.0:${PORT}`)
    } else {
        console.log("Failed to run server.")
    }
})

app.get("/", (res, _) => {
    res.writeStatus(HttpStatus.OK)
    res.end("Hello, World!")
})

app.get("/req-loopback", (res, req) => {
    res.writeStatus(HttpStatus.OK)
    res.writeHeader("Content-Type", "text/html")
    res.write("<h2>Hello, your headers are:</h2><ul>")
    req.forEach((k, v) => {
        res.write("<li>")
        res.write(k)
        res.write(" = ")
        res.write(v)
        res.write("</li>")
    })

    res.end("</ul>")
})

app.post("/auth/signup", handleCreateUser)
