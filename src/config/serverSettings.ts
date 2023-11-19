import express  from "express";
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import env from "../utils/env"
import path from "path"
import logger from "@utils/logger/dataLogger";

const EJS_PATH = path.join(__dirname, "../", "../", "../", "client", "src")
const STATIC_FILES_PATH = express.static(path.join(__dirname, "../", "../", "../", "client", "public"))

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', EJS_PATH);
app.use(STATIC_FILES_PATH)
app.use(express.json())
app.use(cors())
app.use(cookieParser())

let PORT = env("SERVER_PORT")

server.listen(PORT, () => {
    logger.Events(`listening on port ${PORT}`)
  });

export default app
