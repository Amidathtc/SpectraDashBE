
import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import { EnvironmentVariables } from "../config/envV"



// GOOGLE_ID;
// G_SECRET
// G_REFRESH
// G_URL

const GOOGLE_ID: string = EnvironmentVariables.G_ID!;
const GOOGLE_SECRET: string = EnvironmentVariables.G_SECRET!;
const GOOGLE_REFRESH_TOKEN: string = EnvironmentVariables.G_REFRESH!;
const GOOGLE_URL: string = EnvironmentVariables.G_URL!;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_REFRESH_TOKEN });


const URL: string = `http://localhost:1200/api/`;

export const sendMail = async (user: any, tokenID: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "uchennaaustine8@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const passedData = {
      email: user?.email,
      url: `${URL}/${tokenID}/verify/${user?._id}`,
    };

    const locateFile = path.join(__dirname, "../views/verifyMail.ejs");
    const readData = await ejs.renderFile(locateFile, passedData);

    const mailer:any= {
      // from: `verify email ${user.email}`,
      from: `sceptredash@gmail.com`,
      to: user?.email,
      subject: "Email Verification",
      html: readData,
    };  

    await transport.sendMail(mailer).then(() => {
      console.log("A Mail Has Being Sent .....");
    })
    .catch((err) => console.log(err));;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const resetMail = async (user: any, token: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "udidagodswill7@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken,
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

    transport.sendMail(mailer!)
    .then(()=> {
      console.log("Mail sent successfully");
      
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
