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


// PORT=1200
// # MONGO_URL= mongodb+srv://ogunbiyiamidat65:ogunbiyiamidat65@cluster0.tidrfny.mongodb.net/SpectraDash?retryWrites=true&w=majority 

// MONGODB_URI= "mongodb://127.0.0.1:27017/SpectraDashBE"
// CLOUD_NAME = "dirrncimm"
// CLOUD_KEY = "198879469219431"
// CLOUD_SECRET = "U8f7b03CiPBWzJJDjVPU_MF5IJM"

// G_ID = "350112565242-6vg8nj5odo3p0scscedorsbll9t6u613.apps.googleusercontent.com"
// G_SECRET = "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"
// G_REFRESH = "1//04CIhzfu8bPUeCgYIARAAGAQSNwF-L9Ir_CY_w6TB_6QNSUxAVlDBGB8CHsLS2b9MixUIwO-secYSvkCCTMgV4d8asYExrzMF5Qo"
// G_URL = "https://developers.google.com/oauthplayground"
