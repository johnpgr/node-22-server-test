import { App } from "uWebSockets.js"

const PORT = parseInt(process.env.PORT ?? "3000")

const app = App();

app.listen(PORT, (socket) => {
    if (socket) {
        console.log(`App running in http://0.0.0.0:${PORT}`)
    } else {
        console.log("Failed to run server.")
    }
});

app.get("/", (res, _) => {
    res.end("Hello, World!");
});

app.get("/req-loopback", (res, req) => {
    res.writeHeader('Content-Type', 'text/html');
    res.write(`<h1>${req.getMethod().toUpperCase()} 200</h1>`)
    res.write('<h2>Hello, your headers are:</h2><ul>');
    req.forEach((k, v) => {
        res.write('<li>');
        res.write(k);
        res.write(' = ');
        res.write(v);
        res.write('</li>');
    });

    res.end('</ul>');
});
