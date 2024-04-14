import mongoose from "mongoose";
import { iProfileData } from "../interface/interface";

const profileModel = new mongoose.Schema<iProfileData>(
  {
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    userID: {
      type: String,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    
  
  },
  { timestamps: true }
);

export default mongoose.model<iProfileData>("profiles", profileModel);
