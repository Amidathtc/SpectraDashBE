"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.EnvironmentVariables = {
    DB_LIVEURI: process.env.Db_Connection_String,
    DB_LOCALURL: process.env.MONGODB_URI,
    Session_Secret: process.env.SESSION_SECRET,
    PORT: parseInt(process.env.PORT),
    AdminName: process.env.AdminName,
    AdminEmail: process.env.AdminEmail,
    AdminPassword: process.env.AdminPassword,
    G_ID: process.env.G_ID,
    G_SECRET: process.env.G_SECRET,
    G_REFRESH: process.env.G_REFRESH,
    G_URL: process.env.G_URL
};
