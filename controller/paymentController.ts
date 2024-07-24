import { Response } from "express";
import orderModels from "../model/OrdersModel";
import PaymentModel from "../model/PaymentModel";
import paystackService from "../Utils/service/paystackService";

export const payForOrder = async (req: any, res: Response) => {
  const { orderId } = req.params;

  const order: any = await orderModels.findById(orderId);
  const { email } = order.sender;
  const amount = order.orderPricing * 100;
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  try {
    const paymentResponse = await paystackService.initializePayment(
      // order.orderPricing * 100,
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
