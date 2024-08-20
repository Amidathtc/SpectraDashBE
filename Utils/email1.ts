// import nodemailer from "nodemailer";
// import { google } from "googleapis";
// import path from "path";
// import ejs from "ejs";
// import { EnvironmentVariables } from "../config/envV";

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

import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import { EnvironmentVariables } from "../config/envV";

const CLIENT_ID: string = EnvironmentVariables.CLIENT_ID!;
const CLIENT_SECRET: string = EnvironmentVariables.CLIENT_SECRET!;
const REDIRECT_URI: string = EnvironmentVariables.REDIRECT_URI!;
const REFRESH_TOKEN: string = EnvironmentVariables.REFRESH_TOKEN!;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const URL: string = `https://sceptredash.com`;

export const sendMail = async (user: any) => {
  try {
    const accessToken: any = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
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
      email: user?.email,
      url: `${URL}/verify/${user?._id}`,
    };

    const locateFile = path.join(__dirname, "../views/verifyMail.ejs");
    const readData = await ejs.renderFile(locateFile, passedData);

    const mailer: any = {
      from: `Sceptredash📧<sceptredash@gmail.com>`,
      to: user?.email,
      subject: "Email Verification",
      html: readData,
    };

    const result: any = await transport.sendMail(mailer);
    console.log("A Mail Has Being Sent .....");
    return result;
  } catch (error: any) {
    console.log(`errorStack:${error}`);
    console.log(`errorMessage:${error.message}`);
  }
};

export const resetMail = async (user: any, token: any) => {
  try {
    const accessToken: any = (await oAuth2Client.getAccessToken()).token;
    const transport = nodemailer.createTransport({
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

    const locateFile = path.join(__dirname, "../views/resetNote.ejs");
    const readData = await ejs.renderFile(locateFile, passedData);

    const mailer = {
      from: `verifier <udidagodswill7@gmail.com>`,
      to: user.email,
      subject: "Reset Password Mail",
      html: readData,
    };

    await transport.sendMail(mailer!).then(() => {
      console.log("Mail sent successfully");
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
