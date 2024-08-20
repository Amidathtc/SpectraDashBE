"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.EnvironmentVariables = {
    DB_LIVEURl: process.env.MONGODB_URL_LIVE,
    DB_LOCALURL: process.env.MONGODB_URl,
    ZOHO_EMAIL: process.env.ZOHO_EMAIL,
    Session_Secret: process.env.SESSION_SECRET,
    PORT: parseInt(process.env.PORT),
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    REDIRECT_URI: process.env.REDIRECT_URI,
};
