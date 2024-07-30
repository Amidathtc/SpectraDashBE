
import express, { Application, Response, Request, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { HTTPCODES, MainAppError } from "./Utils/MainAppError";
import { EnvironmentVariables } from "./config/envV";
import rateLimit from "express-rate-limit";
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
    message: "Please come back in 5 mins time!!!",
  });

  app
    // Uncomment this line if you want to enable rate limiting
    // .use(limiter)
    .use(express.json())
    .use(
      cors({
        origin: "*", // Adjust this to your frontend URL in production
        methods: ["GET", "PATCH", "POST", "DELETE"],
        credentials: true, // Allow credentials
      })
    )
    .use(morgan("dev"))
    .use(cookieParser())
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
    .get("/", (req: Request, res: Response) => {
      res.status(HTTPCODES.OK).json({
        message: "AD Ready 🚀🚀",
      });
    })
    .use("/api", userRouter)
    .use("/api", ProfileRouter)
    .use("/api", ordersRouter)
    .use("/api", agentsRouter)
    .use("/api/payments", paymentRoutes)
    .set("view engine", "ejs")
    .get("/ejs", (req: Request, res: Response) => {
      res.render("verifyMail");
    })
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      return next(
        new MainAppError({
          message: `Are You Lost? ${req.originalUrl} Not found`,
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    })
    // Error handling middleware
    .use((err: MainAppError, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(err);
      }
      res.status(err.httpcode || 500).json({
        message: err.message || "Internal Server Error",
      });
    });
};
