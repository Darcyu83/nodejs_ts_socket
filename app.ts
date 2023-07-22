import dotenv from "dotenv";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import indexRouter from "./routes";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import Websocket from "ws";
import http from "http";
import Socket from "./modules/socket_ws";
import nunjucks from "nunjucks";
import initSocketIO from "./modules/socket_socketIO";
import initSocketWS from "./modules/socket_ws";
dotenv.config();
const app = express();

app.set("port", process.env.PORT || 4013);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || "none",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 라우터
app.use("/", indexRouter);

const handleWrongRequest: RequestHandler = (req, res, next) => {
  const err = new Error(`${req.method} ${req.url} :: 잘못된 요청입니다.`);
  err.status = 404;
  next(err);
};
const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ code: err.status, message: err.message });
};

// 잘못된 url
app.use(handleWrongRequest);
// 에러 핸들러
app.use(handleError);

const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 대기 중");
});

// 소켓 활성화
// initSocketWS(server);
initSocketIO(server);
