import { Document, Schema, model, Types } from "mongoose";
import { iOrder } from "../interface/interface";

interface iOrderData extends iOrder, Document {}

const orderStatus = ["pending", "processing", "shipped", "delivered"]; // Order status options

const ordersSchema = new Schema<iOrderData>(
  {
    sender: {
      country: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      unit_aptNo: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: Number, required: true },
      phoneNo: { type: Number, required: true },
      email: { type: String, required: true },
    },

    receiver: {
      country: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      unit_aptNo: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: Number, required: true },
      phoneNo: { type: Number, required: true },
      email: { type: String, required: true },
    },

    shipmentDetails: {
      typeOfItem: { type: String, required: true },
      color: { type: String },
      brand: { type: String },
      itemForm: { type: String },
      quantity: { type: Number, required: true },
      itemValue: { type: String, required: true },
    },
    
    shipmentMetrics: {
      weight_kg: { type: String, required: true },
      length_cm: { type: Number, required: true },
      width_cm: { type: String, required: true },
      height_cm: { type: String, required: true },
    },

    user: { type: Types.ObjectId, required: true, ref: "users" }, // User reference

    status: {
      type: String,
      enum: orderStatus, // Limit status to available options
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderModels = model<iOrderData>("orders", ordersSchema);

export default orderModels;
