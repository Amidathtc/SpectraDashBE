import mongoose, { Document, Schema, Types, model } from "mongoose"
import { IPayment } from "../interface/interface"

interface IPaymentData extends IPayment , Document {}

export const PaymentSchema = new Schema<IPaymentData>(

    {
    
        email: {
            type: String,
            unique: true,
            required: [true, "Your email is required"],
          },

          amount:{
             type: Number,
             required:[true, "Enter needed amount"]
          }
    },

    {timestamps:true}
);
const PaymentModel = model<IPaymentData>("Payment", PaymentSchema);

export default PaymentModel;