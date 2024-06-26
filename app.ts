import express, { Application, Response, Request, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./MiddleWare/Error/ErrorHandler";
import { HTTPCODES, MainAppError } from "./Utils/MainAppError";
import userRoute from "./routes/userRoute";
import ordersRoute from "./routes/ordersRouter";
import profileRoute from "./routes/profileRouter";
import { EnvironmentVariables } from "./config/envV";
import rateLimit from "express-rate-limit";
import MongoDB from "connect-mongodb-session";

export const MainAppConfig = (app: Application) => {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Please come back in 5mins time!!!",
  });
  // Set up session management
  const MongoDBStore = MongoDB(session);
  const sessionStore: any = new MongoDBStore({
    uri: EnvironmentVariables.DB_LIVEURl!,
    collection: "sessions",
  });

  app
    .use(express.json())
    // .use(limiter)
    .use(cors({ origin: "*", methods: ["GET, PATCH, POST, DELETE"] }))
    .use(morgan("dev"))
    .use(cookieParser())

    .use((req: Request, res: Response, next: NextFunction) => {
      res.header(
        "Access-Control-Allow-Origin",
        "https://sceptredash.vercel.app"
      );
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
          // maxAge: 1000 * 60 * 24 * 60,
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
    .use("/api", userRoute) //Routes
    .use("/api", profileRoute) //Routes
    .use("/api", ordersRoute) //Orders Routes
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
