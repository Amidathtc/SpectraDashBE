"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentForOrder = exports.payForOrder = void 0;
const OrdersModel_1 = __importDefault(require("../model/OrdersModel"));
const PaymentModel_1 = __importDefault(require("../model/PaymentModel"));
const paystackService_1 = __importDefault(require("../Utils/service/paystackService"));
const payForOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const order = yield OrdersModel_1.default.findById(orderId);
    const { email } = order.sender;
    const amount = order.orderPricing * 100;
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    try {
        const paymentResponse = yield paystackService_1.default.initializePayment(
        // order.orderPricing * 100,
        amount, email);
        // Save payment details to the database
        const payment = new PaymentModel_1.default({
            orderId: order._id,
            amount,
            reference: paymentResponse.data.reference,
        });
        yield payment.save();
        res.status(200).json({
            message: "Payment was successful",
            data: paymentResponse.data,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.payForOrder = payForOrder;
const verifyPaymentForOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.params;
    try {
        const verificationResponse = yield paystackService_1.default.verifyPayment(reference);
        if (verificationResponse.data.status) {
            // Update payment status in the database
            yield PaymentModel_1.default.updateOne({ reference }, { status: verificationResponse.data.status });
            // Optionally, update order status here
            yield OrdersModel_1.default.updateOne({ _id: verificationResponse.data.metadata.orderId }, { status: "paid" } // Update order status as needed
            );
            res.status(200).json({
                message: "Payment was verified",
                data: verificationResponse.data,
            });
        }
        else {
            res.status(400).json({ message: "Payment verification failed." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifyPaymentForOrder = verifyPaymentForOrder;
