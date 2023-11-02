import express  from "express";
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import env from "../utils/env"
import path from "path"

const app = express();
const server = http.createServer(app);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, "../", "../", "../", "client", "src"));
app.use(express.static("C:/Users/usman/Desktop/Job Board/client/public"))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

let PORT = env("SERVER_PORT")

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

export default app
