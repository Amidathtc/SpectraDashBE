"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppConfig = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandler_1 = require("./MiddleWare/Error/ErrorHandler");
const MainAppError_1 = require("./Utils/MainAppError");
const envV_1 = require("./config/envV");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const interface_1 = require("./interface/interface");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const profileRouter_1 = __importDefault(require("./routes/profileRouter"));
const ordersRouter_1 = __importDefault(require("./routes/ordersRouter"));
const agentRouter_1 = __importDefault(require("./routes/agentRouter"));
const paymentRouter_1 = __importDefault(require("./routes/paymentRouter"));
const MainAppConfig = (app) => {
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000,
        limit: 5,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        message: "Please come back in 5mins time!!!",
    });
    app
        .use(express_1.default.json())
        // .use(limiter)
        .use((0, cors_1.default)({ origin: "*", methods: ["GET", "PATCH", "POST", "DELETE"] }))
        .use((0, morgan_1.default)("dev"))
        .use((0, cookie_parser_1.default)())
        .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    })
        .use((0, express_session_1.default)({
        secret: envV_1.EnvironmentVariables.Session_Secret,
        resave: false,
        saveUninitialized: true,
        store: interface_1.sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "lax",
            secure: false,
        },
    }))
        // landing route
        .get("/", (req, res) => {
        res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "AD Ready 🚀🚀",
        });
    })
        .use("/api", userRouter_1.default) //Routes
        .use("/api", profileRouter_1.default) //Routes
        .use("/api", ordersRouter_1.default) //Orders Routes
        .use("/api", agentRouter_1.default) //agents Routes
        .use("/api/payments", paymentRouter_1.default) //payment Routes
        .set("view engine", "ejs")
        .get("/ejs", (req, res) => {
        res.render("verifyMail");
    })
        .all("*", (req, res, next) => {
        //   Configuring Routes for the application:
        return next(new MainAppError_1.MainAppError({
            message: `Are You Lost? ${req.originalUrl} Not found`,
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }) // 404 Routes
        .use(ErrorHandler_1.errorHandler); // error handler
};
exports.MainAppConfig = MainAppConfig;
