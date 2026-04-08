import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";

const app = express();

//Cors policy handle diffrent port
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  }),
);

//json data handle in backend with limitations
app.use(express.json({ limit: "16kb" }));

//data from urls
app.use(express.urlencoded({limit:"16kb"}));

//assets files photo etc
app.use(express.static("public"));

//server to user browser for acccess cookies
app.use(cookieParser());

export { app };
