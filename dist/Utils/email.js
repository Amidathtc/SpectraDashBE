"use strict";
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
const ZOHO_EMAIL = envV_1.EnvironmentVariables.ZOHO_EMAIL;
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
                user: ZOHO_EMAIL, // Your Zoho email address
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
const resetMail = (user, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessTokenResponse = yield oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token; // Get the token
        // Check if the access token is valid
        if (!accessToken) {
            throw new Error('Access token is not available.');
        }
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: ZOHO_EMAIL,
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
        const templatePath = path_1.default.join(__dirname, '../views/resetPassword.ejs');
        const templateString = yield promises_1.default.readFile(templatePath, 'utf-8');
        const html = ejs_1.default.render(templateString, passedData);
        const mailOptions = {
            from: `Sceptredash📧< ZOHO_EMAIL>`,
            to: user.email,
            subject: 'Reset Password Mail',
            html,
        };
        yield transporter.sendMail(mailOptions);
        console.log('Mail sent successfully');
    }
    catch (error) {
        console.error(error.message);
    }
});
exports.resetMail = resetMail;
