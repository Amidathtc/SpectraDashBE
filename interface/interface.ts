import MongoDB from "connect-mongodb-session";
import { Types, Document } from "mongoose";
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
  paymentHistory: Array<{}>;
}

interface IDeliveryZone {
  zone_name: string;
  countries: Array<string>;
  kg_prices: Array<{
    from_kg: number;
    to_kg: number;
    price: number;
  }>;
}
export interface IAgent {
  agentName: string;
  agentCompanyName?: string; // Optional property
  agentZones: Array<IDeliveryZone>; // Use the new interface for zones
  orders: Array<{}>; // Placeholder for orders (structure not provided)
  role: string;
  deliveryDays: string;
}

export interface IPayment {
  email: string;
  amount: number;
}

export interface iOrder {
  sender: {
    type: {
      country: string;
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      phoneNumber: string;
      email: string;
    };
  };
  receiver: {
    type: {
      country: string;
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      phoneNumber: string;
      email: string;
    };
  };
  shipmentDetails: [
    type: {
      typeOfItem: string;
      color: string;
      detailsOfItem: string;
      quantity: number;
      itemValue: number;
    }
  ];
  shipmentMetrics: {
    type: {
      weight_kg: number;
      length_cm: number;
      width_cm: number;
    };
  };
  userID: {};
  agentID: {};
  payment: {};
  status: string;
  orderPricing: number;
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

export interface IUserProfile {
  profileAvatar: string;
  firstName: string;
  lastName: string;
  user: {};
}

export interface IUserProfileData extends IUserProfile, Document {}

const MongoDBStore = MongoDB(session);
export const sessionStore: any = new MongoDBStore({
  uri: EnvironmentVariables.DB_LIVEURl!,
  collection: "sessions",
});
