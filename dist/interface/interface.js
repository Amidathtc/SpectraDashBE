"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const envV_1 = require("../config/envV");
const express_session_1 = __importDefault(require("express-session"));
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
exports.sessionStore = new MongoDBStore({
    uri: envV_1.EnvironmentVariables.DB_LIVEURl,
    collection: "sessions",
});
