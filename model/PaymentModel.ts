import { Document, Schema, model, Types } from "mongoose";

interface IPaymentData extends Document {
  orderId: Types.ObjectId; // Reference to the order
  amount: number; // Amount charged
  currency: string; // Currency type
  status: string; // Payment status (e.g., 'successful', 'pending', 'failed')
  reference: string; // Paystack payment reference
}

const paymentSchema = new Schema<IPaymentData>(
  {
    orderId: { type: Schema.Types.ObjectId, required: true, ref: "orders" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" }, // Default currency
    status: {
      type: String,
      enum: ["successful", "pending", "failed"],
      default: "pending",
    },
    reference: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const PaymentModel = model<IPaymentData>("payments", paymentSchema);

export default PaymentModel;
