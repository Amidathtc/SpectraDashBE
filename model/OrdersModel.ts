import { Document, Schema, model, Types } from "mongoose";
import { iOrder } from "../interface/interface";

interface iOrderData extends iOrder, Document {}

const ordersSchema = new Schema<iOrderData>(
  {
    sender: {
      country: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      street: {
        type: String,
      },
      unit_aptNo: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      phoneNo: {
        type: Number,
      },
      email: {
        type: String,
      },
    },

    receiver: {
      country: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      street: {
        type: String,
      },
      unit_aptNo: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      phoneNo: {
        type: Number,
      },
      email: {
        type: String,
      },
    },

    shipmentDetails: {
      typeOfItem: {
        type: String,
      },
      Color: {
        type: String,
      },
      brand: {
        type: String,
      },
      useOfItem: {
        type: String,
      },
      itemForm: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      itemValue: {
        type: String,
      },
    },
    user: {
      type: Types.ObjectId,
    },
  },
  { timestamps: true }
);

const orderModels = model<iOrderData>("orders", ordersSchema);
// export
export default orderModels;
