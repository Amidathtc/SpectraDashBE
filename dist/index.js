"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./app");
const envV_1 = require("./config/envV");
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Preventing the server from crashing
process.on("uncaughtException", (error) => {
    console.log("Server is Shutting down due to uncaughtException", error);
    process.exit(1);
});
// The port of our backend server
const port = envV_1.EnvironmentVariables.PORT || 1200;
// Extantiating our server from express
const app = (0, express_1.default)();
// Connecting main app configuration
(0, app_1.MainAppConfig)(app);
// Server is connected and listening to port
const server = app.listen(port || process.env.PORT, () => {
    console.clear();
    // Connecting DB to server
    (0, database_1.DBCONNECTION)();
    console.log("Server is up and running 🚀🚀 \nListening to Server on port:", port);
});
process.once("unhandledRejection", (reason) => {
    console.log("Server is Shutting down due to unhandledRejection", reason);
    server.close(() => {
        process.exit(1);
    });
});
