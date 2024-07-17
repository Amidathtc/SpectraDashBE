import mongoose, { Document, Schema, Types, model } from "mongoose";
import { Iuser } from "../interface/interface";

interface IUserData extends Iuser, Document {}

// interface AllUsers extends Iuser, Document {}

export const UserSchema = new Schema<IUserData>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Your email is required"],
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    firstName: {
      type: String,
      required: [true, "Your First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Your Last Name is required"],
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders",
      },
    ],
    profile: [
      {
        type: Types.ObjectId,
        ref: "userprofiles",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = model<IUserData>("users", UserSchema);

export default UserModel;
