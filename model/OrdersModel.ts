import { Document, Schema, model, Types } from "mongoose";
import { iOrder } from "../interface/interface";

interface iOrderData extends iOrder, Document {}

const orderStatus = ["pending", "processing", "shipped", "delivered", "paid"]; // Added 'paid' status

const senderCountry = "Nigeria"; // Order status options

const ordersSchema = new Schema<iOrderData>(
  {
    sender: {
      country: {
        type: String,
        required: true,
        enum: senderCountry, // Limit status to available options
        default: "Nigeria",
      },
      firstName: { type: String, trim: true, required: true },
      lastName: { type: String, trim: true, required: true },
      address: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      phoneNumber: { type: String, trim: true, required: true },
      email: { type: String, trim: true, required: true },
    },

    receiver: {
      country: { type: String, required: true },
      firstName: { type: String, trim: true, required: true },
      lastName: { type: String, trim: true, required: true },
      address: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      phoneNumber: { type: String, trim: true, required: true },
      email: { type: String, trim: true, required: true },
    },

    shipmentDetails: [
      {
        typeOfItem: { type: String, required: true },
        color: { type: String },
        detailsOfItem: { type: String },
        quantity: { type: Number, required: true },
        itemValue: { type: Number, required: true },
      },
    ],

    shipmentMetrics: {
      weight_kg: { type: Number, required: true },
      length_cm: { type: Number, required: true },
      width_cm: { type: Number, required: true },
    },

    userID: { type: Types.ObjectId, required: true, ref: "users" }, // User reference

    agentID: { type: Types.ObjectId, required: true, ref: "agents" }, // Agents reference

    status: {
      type: String,
      enum: orderStatus, // Limit status to available options
      default: "pending",
    },

    orderPricing: {
      type: Number,
      required: true,
    },

    payment: {
      reference: { type: String }, // Paystack payment reference
      status: {
        type: String,
        enum: ["successful", "pending", "failed"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

const orderModels = model<iOrderData>("orders", ordersSchema);

export default orderModels;
