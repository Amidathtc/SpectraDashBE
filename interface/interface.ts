import mongoose from "mongoose";

export interface Iuser {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  profile: Array<string>;
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
  avatarID: string;
  name: string;
  phoneNumber: string;
  address: string;
  userID: string;
  user: {};
}

export interface iProfileData extends iProfile, mongoose.Document {}