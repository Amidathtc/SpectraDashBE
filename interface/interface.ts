import MongoDB from "connect-mongodb-session";
import mongoose, { Types } from "mongoose";
import { EnvironmentVariables } from "../config/envV";
import session from "express-session";

export interface Iuser {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
  verified: boolean;
  profile: Array<{}>;
  orders: Array<{}>;
}

export interface Iagent {
  AgentCompanyname: string;
  AgentEmail: string;
  password: string;
  verified: boolean;
  profile: Array<string>;
  fullName: string;
  role: string;
}

export interface IShipmentHistory {
  DATE: string;
  TIME: string;
  LOCATION: string;
  STATUS: string;
  UPDATEDBY: string;
  REMARKS: string;
}
export interface IShipmentHistory {
  DATE: string;
  TIME: string;
  LOCATION: string;
  STATUS: string;
  UPDATEDBY: string;
  REMARKS: string;
}

export interface Iclient {
  NAME: string;
  ADDRESS: string;
  PHONE: string;
  EMAIL: string;
  ORIGIN: string;
  PACKAGE: string;
  DESTINATION: string;
  CARRIER: string;
  TYPEOFSHIPMENT: string;
  WEIGHT: string;
  SHIPMENTMODE: string;
  CARRIERREFERENCENO: string;
  PRODUCT: string;
  QTY: string;
  PAYMENTMODE: string;
  TOTALFREIGHT: string;
  EXPECTEDDELIVERYDATE: string;
  DEPARTURETIME: string;
  PICKUPDATE: string;
  PICKUPTIME: string;
  COMMENTS: string;
  PIECETYPE: string;
  DESCRIPTION: string;
  LENGTH: string;
  WIDTH: string;
  HEIGHT_KG: string;
  WEIGHT_KG: string;
  ShipmentHistory: {}[];
}

export interface iProfile {
  avatar: string;
  // profileAvatarID: string;
  password: string;
  userID: string;
  user: {};
}

export interface iOrder {
  sender: {
    type: {
      country: string;
      firstName: string;
      lastName: string;
      street: string;
      unit_aptNo: string;
      city: string;
      state: string;
      postalCode: number;
      phoneNo: number;
      email: string;
    };
  };
  receiver: {
    type: {
      country: string;
      firstName: string;
      lastName: string;
      street: string;
      unit_aptNo: string;
      city: string;
      state: string;
      postalCode: number;
      phoneNo: number;
      email: string;
    };
  };
  shipmentDetails: {
    type: {
      typeOfItem: string;
      Color: string;
      brand: string;
      itemForm: string;
      quantity: number;
      itemValue: string;
    };
  };
  shipmentMetrics: {
    type: {
      weight_kg: number;
      length_cm: number;
      width_cm: number;
      height_cm: number;
    };
  };
  user: {};
  status: string;
}

export interface iProfileData extends iProfile, mongoose.Document {}

const MongoDBStore = MongoDB(session);
export const sessionStore: any = new MongoDBStore({
  uri: EnvironmentVariables.DB_LIVEURl!,
  collection: "sessions",
});
