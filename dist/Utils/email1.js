"use strict";
// import nodemailer from "nodemailer";
// import { google } from "googleapis";
// import path from "path";
// import ejs from "ejs";
// import { EnvironmentVariables } from "../config/envV";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMail = exports.sendMail = void 0;
// const CLIENT_ID: string = EnvironmentVariables.CLIENT_ID!;
// const CLIENT_SECRET: string = EnvironmentVariables.CLIENT_SECRET!;
// const REDIRECT_URI: string = EnvironmentVariables.REDIRECT_URI!;
// const REFRESH_TOKEN: string = EnvironmentVariables.REFRESH_TOKEN!;
// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const URL: string = `https://sceptredash.com`;
// export const sendMail = async (user: any) => {
//   try {
//     // const accessToken: any = (await oAuth2Client.getAccessToken()).token;
//     const accessToken: any = await oAuth2Client.getAccessToken();
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: "uchennaaustine8@gmail.com",
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//       logger: true, // Log to console
//       debug: true,
//     });
//     const passedData = {
//       email: user?.email,
//       url: `${URL}/verify/${user?._id}`,
//     };
//     const locateFile = path.join(__dirname, "../views/verifyMail.ejs");
//     const readData = await ejs.renderFile(locateFile, passedData);
//     const mailer: any = {
//       // from: `verify email ${user.email}`,
//       from: `Sceptredash📧<sceptredash@gmail.com>`,
//       to: user?.email,
//       subject: "Email Verification",
//       html: readData,
//     };
//     const result: any = await transport
//       .sendMail(mailer)
//       .then(() => {
//         console.log("A Mail Has Being Sent .....");
//       })
//       .catch((error: any) =>
//         console.log(`errorStack:${error}errorMessage:${error.message}`)
//       );
//     return result;
//   } catch (error: any) {
//     console.log(`errorStack:${error}`);
//     console.log(`errorMessage:${error.message}`);
//   }
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const envV_1 = require("../config/envV");
const CLIENT_ID = envV_1.EnvironmentVariables.CLIENT_ID;
const CLIENT_SECRET = envV_1.EnvironmentVariables.CLIENT_SECRET;
const REDIRECT_URI = envV_1.EnvironmentVariables.REDIRECT_URI;
const REFRESH_TOKEN = envV_1.EnvironmentVariables.REFRESH_TOKEN;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const URL = `https://sceptredash.com`;
const sendMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth2Client.getAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "uchennaaustine8@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
            logger: true, // Log to console
            debug: true,
        });
        const passedData = {
            email: user === null || user === void 0 ? void 0 : user.email,
            url: `${URL}/verify/${user === null || user === void 0 ? void 0 : user._id}`,
        };
        const locateFile = path_1.default.join(__dirname, "../views/verifyMail.ejs");
        const readData = yield ejs_1.default.renderFile(locateFile, passedData);
        const mailer = {
            from: `Sceptredash📧<sceptredash@gmail.com>`,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Email Verification",
            html: readData,
        };
        const result = yield transport.sendMail(mailer);
        console.log("A Mail Has Being Sent .....");
        return result;
    }
    catch (error) {
        console.log(`errorStack:${error}`);
        console.log(`errorMessage:${error.message}`);
    }
});
exports.sendMail = sendMail;
const resetMail = (user, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth2Client.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "uchennaaustine8@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const passedData = {
            email: user.email,
            url: `${URL}/${token}/reset-user-password`,
        };
        const locateFile = path_1.default.join(__dirname, "../views/resetNote.ejs");
        const readData = yield ejs_1.default.renderFile(locateFile, passedData);
        const mailer = {
            from: `verifier <udidagodswill7@gmail.com>`,
            to: user.email,
            subject: "Reset Password Mail",
            html: readData,
        };
        yield transport.sendMail(mailer).then(() => {
            console.log("Mail sent successfully");
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.resetMail = resetMail;
