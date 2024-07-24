import { Response, Request } from "express";
import orderModels from "../model/OrdersModel";
import PaymentModel from "../model/PaymentModel";
import paystackService from "../Utils/service/paystackService";
import UserModel from "../model/userModel";

export const payForOrder = async (req: any, res: Response) => {
  const { orderId } = req.params;

  const order: any = await orderModels.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const { email } = order.sender;
  const amount = order.orderPricing * 100;

  try {
    const paymentResponse = await paystackService.initializePayment(
      amount,
      email
    );

    // Save payment details to the database
    const payment = new PaymentModel({
      orderId: order._id,
      amount,
      reference: paymentResponse.data.reference,
    });
    await payment.save();

    // Update user's payment history
    await UserModel.updateOne(
      { _id: order.user }, // Assuming order has a userId field
      { $push: { paymentHistory: payment._id } } // Add payment ID to user's payment history
    );

    res.status(200).json({
      message: "Payment was successful",
      data: paymentResponse.data,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPaymentForOrder = async (req: any, res: Response) => {
  const { reference } = req.params;

  try {
    const verificationResponse = await paystackService.verifyPayment(reference);

    if (verificationResponse.data.status) {
      // Update payment status in the database
      await PaymentModel.updateOne(
        { reference },
        { status: verificationResponse.data.status }
      );

      // Optionally, update order status here
      await orderModels.updateOne(
        { _id: verificationResponse.data.metadata.orderId },
        { status: "paid" } // Update order status as needed
      );

      res.status(200).json({
        message: "Payment was verified",
        data: verificationResponse.data,
      });
    } else {
      res.status(400).json({ message: "Payment verification failed." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentModel.find().populate("orderId");
    res.status(200).json({ message: "All Payments", data: payments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
