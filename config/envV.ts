import dotenv from "dotenv";
dotenv.config();

export const EnvironmentVariables = {
  DB_LIVEURI: process.env.Db_Connection_String,
  DB_LOCALURL: process.env.MONGODB_URI! as string,
  Session_Secret: process.env.SESSION_SECRET as string,
  PORT: parseInt(process.env.PORT as string),
  AdminName: process.env.AdminName as string,
  AdminEmail: process.env.AdminEmail as string,
  AdminPassword: process.env.AdminPassword as string,
};
