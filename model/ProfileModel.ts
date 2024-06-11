import { Types, model, Schema } from "mongoose";
import { iProfileData } from "../interface/interface";

const profileModel = new Schema<iProfileData>(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    userID: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default model<iProfileData>("profiles", profileModel);
