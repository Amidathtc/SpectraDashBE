import express, { Application, Response, Request, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./MiddleWare/Error/ErrorHandler";
import { HTTPCODES, MainAppError } from "./Utils/MainAppError";
import { EnvironmentVariables } from "./config/envV";
import rateLimit from "express-rate-limit";
import MongoDB from "connect-mongodb-session";
import { sessionStore } from "./interface/interface";
import userRouter from "./routes/userRouter";
import ProfileRouter from "./routes/profileRouter";
import ordersRouter from "./routes/ordersRouter";
import agentsRouter from "./routes/agentRouter";
import paymentRoutes from "./routes/paymentRouter";

export const MainAppConfig = (app: Application) => {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Please come back in 5mins time!!!",
  });

  app
    .use(express.json())
    // .use(limiter)
    .use(cors({ origin: "*", methods: ["GET", "PATCH", "POST", "DELETE"] }))
    .use(morgan("dev"))
    .use(cookieParser())

    .use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PATCH, PUT, POST, DELETE"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type");
      next();
    })
    .use(
      session({
        secret: EnvironmentVariables.Session_Secret,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: "lax",
          secure: false,
        },
      })
    )

    // landing route
    .get("/", (req: Request, res: Response) => {
      res.status(HTTPCODES.OK).json({
        message: "AD Ready 🚀🚀",
      });
    })
    .use("/api", userRouter) //Routes
    .use("/api", ProfileRouter) //Routes
    .use("/api", ordersRouter) //Orders Routes
    .use("/api", agentsRouter) //agents Routes
    .use("/api/payments", paymentRoutes) //payment Routes
    .set("view engine", "ejs")
    .get("/ejs", (req: Request, res: Response) => {
      res.render("verifyMail");
    })
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      //   Configuring Routes for the application:
      return next(
        new MainAppError({
          message: `Are You Lost? ${req.originalUrl} Not found`,
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }) // 404 Routes
    .use(errorHandler); // error handler
};
