"use strict";
// import nodemailer, { Transporter } from 'nodemailer';
// import ejs from 'ejs';
// import path from 'path';
// import fs from 'fs';
// import { EnvironmentVariables } from '../config/envV';
// import { google } from 'googleapis'; // Still needed for OAuth2 functionality
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
exports.sendMail = void 0;
// // Set up OAuth2 client for Zoho
// const CLIENT_ID = EnvironmentVariables.CLIENT_ID!;
// const CLIENT_SECRET = EnvironmentVariables.CLIENT_SECRET!;
// const REDIRECT_URI = EnvironmentVariables.REDIRECT_URI!;
// const REFRESH_TOKEN = EnvironmentVariables.REFRESH_TOKEN!;
// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const URL = `https://sceptredash.com`;
// export const sendMail = async (user: any) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     const transporter:Transporter = nodemailer.createTransport({
//       host: 'smtp.zoho.com',
//       port: 465,
//       secure: true,
//       auth: {
//         type: 'OAuth2',
//         user: 'info@sceptredash.com', // Your Zoho email address
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken.token, // Access token from OAuth2
//       },
//       logger: true, // Log to console
//   debug: true, // Show debug output
//     });
//     const passedData = {
//       email: user?.email,
//       url: `${URL}/verify/${user?._id}`,
//     };
//     const templatePath = path.join(__dirname, '../views/verifyMail.ejs');
//     const templateString = fs.readFileSync(templatePath, 'utf-8');
//     const html = ejs.render(templateString, passedData);
//     const mailOptions = {
//       from: `Sceptredash📧<info@sceptredash.com>`,
//       to: user?.email,
//       subject: 'Email Verification',
//       html,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log('A Mail Has Been Sent .....');
//   } catch (error: any) {
//     console.error(`errorStack: ${error}`);
//     console.error(`errorMessage: ${error.message}`);
//   }
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises")); // Using fs.promises for async operations
const envV_1 = require("../config/envV"); // Assuming envV provides env variables
const googleapis_1 = require("googleapis"); // Still needed for OAuth2 functionality
// Consider using a library like 'dotenv' for secure environment variable management
const CLIENT_ID = envV_1.EnvironmentVariables.CLIENT_ID;
const CLIENT_SECRET = envV_1.EnvironmentVariables.CLIENT_SECRET;
const REDIRECT_URI = envV_1.EnvironmentVariables.REDIRECT_URI;
const REFRESH_TOKEN = envV_1.EnvironmentVariables.REFRESH_TOKEN;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const URL = `https://sceptredash.com`;
const sendMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessTokenResponse = yield oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token; // Get the token
        // Check if the access token is valid
        if (!accessToken) {
            throw new Error('Access token is not available.');
        }
        // Define the transport options
        const transportOptions = {
            host: 'smtp.zoho.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                type: 'OAuth2',
                user: 'info@sceptredash.com', // Your Zoho email address
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken, // Access token from OAuth2
            },
            logger: true, // Log to console
            debug: true, // Show debug output
        };
        const transporter = nodemailer_1.default.createTransport(transportOptions);
        const passedData = {
            email: user === null || user === void 0 ? void 0 : user.email,
            url: `${URL}/verify/${user === null || user === void 0 ? void 0 : user._id}`,
        };
        const templatePath = path_1.default.join(__dirname, '../views/verifyMail.ejs');
        const templateString = yield promises_1.default.readFile(templatePath, 'utf-8'); // Async reading
        const html = ejs_1.default.render(templateString, passedData);
        const mailOptions = {
            from: `Sceptredash<${envV_1.EnvironmentVariables.ZOHO_EMAIL}>`,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: 'Email Verification',
            html,
        };
        yield transporter.sendMail(mailOptions);
        console.log('A Mail Has Been Sent .....');
    }
    catch (error) {
        console.error('Error sending email:', error.message); // More specific message
        console.error('Error sending email:', error); // More specific message
        // Consider additional error handling (e.g., logging, returning error status)
    }
});
exports.sendMail = sendMail;
// export const resetMail = async (user: any, token: any) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.zoho.com',
//       port: 465,
//       secure: true,
//       auth: {
//         type: 'OAuth2',
//         user: EnvironmentVariables.ZOHO_EMAIL, // Assuming ZOHO_EMAIL is set
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });
//     const passedData = {
//       email: user.email,
//       url: `${URL}/${token}/reset-user-password`,
//     };
//     const templatePath = path.join(__dirname, '../views/resetNote.ejs');
//     const templateString = await fs.readFile(templatePath, 'utf-8'); // Async reading
//     const html = ejs.render(templateString, passedData);
//     const mailOptions = {
//       from: `Sceptredash<${EnvironmentVariables.ZOHO_EMAIL}>`, // Using env variable
//       to: user.email,
//       subject: 'Reset Password Mail',
//       html,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log('Mail sent successfully');
//   } catch (error: any) {
//     console.error('Error sending email:', error.message);
//     // Consider additional error handling (e.g., logging specific errors, returning error status)
//   }
// };
// export const resetMail = async (user: any, token: any) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.zoho.com',
//       port: 465,
//       secure: true,
//       auth: {
//         type: 'OAuth2',
//         user: 'your-zoho-email@zoho.com',
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });
//     const passedData = {
//       email: user.email,
//       url: `${URL}/${token}/reset-user-password`,
//     };
//     const templatePath = path.join(__dirname, '../views/resetNote.ejs');
//     const templateString = fs.readFileSync(templatePath, 'utf-8');
//     const html = ejs.render(templateString, passedData);
//     const mailOptions = {
//       from: `Sceptredash📧<your-zoho-email@zoho.com>`,
//       to: user.email,
//       subject: 'Reset Password Mail',
//       html,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log('Mail sent successfully');
//   } catch (error: any) {
//     console.error(error.message);
//   }
// };
