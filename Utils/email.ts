import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs/promises'; // Using fs.promises for async operations
import { EnvironmentVariables } from '../config/envV'; // Assuming envV provides env variables
import { google } from 'googleapis'; // Still needed for OAuth2 functionality
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Consider using a library like 'dotenv' for secure environment variable management
const CLIENT_ID = EnvironmentVariables.CLIENT_ID;
const CLIENT_SECRET = EnvironmentVariables.CLIENT_SECRET;
const REDIRECT_URI = EnvironmentVariables.REDIRECT_URI;
const REFRESH_TOKEN = EnvironmentVariables.REFRESH_TOKEN;
const ZOHO_EMAIL =  EnvironmentVariables.ZOHO_EMAIL

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const URL = `https://sceptredash.com`;

export const sendMail = async (user: any) => {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token; // Get the token

    // Check if the access token is valid
    if (!accessToken) {
      throw new Error('Access token is not available.');
    }

    // Define the transport options
    const transportOptions: SMTPTransport.Options = {
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        type: 'OAuth2',
        user:  ZOHO_EMAIL, // Your Zoho email address
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken, // Access token from OAuth2
      },
      logger: true, // Log to console
      debug: true, // Show debug output
    };

    const transporter = nodemailer.createTransport(transportOptions);

    const passedData = {
      email: user?.email,
      url: `${URL}/verify/${user?._id}`,
    };

    const templatePath = path.join(__dirname, '../views/verifyMail.ejs');
    const templateString = await fs.readFile(templatePath, 'utf-8'); // Async reading
    const html = ejs.render(templateString, passedData);

    const mailOptions = {
      from: `Sceptredash<${EnvironmentVariables.ZOHO_EMAIL}>`,
      to: user?.email,
      subject: 'Email Verification',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('A Mail Has Been Sent .....');
  } catch (error: any) {
    console.error('Error sending email:', error.message); // More specific message
    console.error('Error sending email:', error); // More specific message
    // Consider additional error handling (e.g., logging, returning error status)
  }
};


export const resetMail = async (user: any, token: any) => {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token; // Get the token

    // Check if the access token is valid
    if (!accessToken) {
      throw new Error('Access token is not available.');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user:  ZOHO_EMAIL,
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

    const templatePath = path.join(__dirname, '../views/resetPassword.ejs');
    const templateString = await fs.readFile(templatePath, 'utf-8');
    const html = ejs.render(templateString, passedData);

    const mailOptions = {
      from: `Sceptredash📧< ZOHO_EMAIL>`,
      to: user.email,
      subject: 'Reset Password Mail',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');
  } catch (error: any) {
    console.error(error.message);
  }
};