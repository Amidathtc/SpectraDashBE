"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "orders",
        index: true,
    }, // Use Schema.Types.ObjectId
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" }, // Default currency
    status: {
        type: String,
        enum: ["successful", "pending", "failed", "refunded"],
        default: "pending",
    },
    reference: { type: String, required: true, unique: true },
}, { timestamps: true });
const PaymentModel = (0, mongoose_1.model)("payments", paymentSchema);
exports.default = PaymentModel;
