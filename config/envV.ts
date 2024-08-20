import dotenv from "dotenv";
dotenv.config();

export const EnvironmentVariables = {
  DB_LIVEURl: process.env.MONGODB_URL_LIVE,
  DB_LOCALURL: process.env.MONGODB_URl! as string,
  ZOHO_EMAIL: process.env.ZOHO_EMAIL! as string,
  Session_Secret: process.env.SESSION_SECRET as string,
  PORT: parseInt(process.env.PORT as string),
  JWT_SECRET: process.env.JWT_SECRET as string,
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
  REDIRECT_URI: process.env.REDIRECT_URI as string,
};
