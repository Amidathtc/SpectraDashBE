import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import UserModel from "../model/userModel";
import orderModels from "../model/OrdersModel";
import agentModel from "../model/AgentModel";

// export const makeOrder = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { userID, agentID } = req.params;
//       const { sender, receiver, shipmentDetails, shipmentMetrics } = req.body;
//       const { weight_kg } = shipmentMetrics; // Assuming weight is a property in shipmentMetrics

//       const user = await UserModel.findById(userID);
//       const agent = await agentModel.findById(agentID).populate("agentZones"); // Populate agentZones

//       if (user && agent && agent?.agentZones.length > 0) {
//         const matchingZone = agent?.agentZones.find((zone: any) => {
//           const { countries } = zone;
//           return countries.includes(receiver?.country); // Check if receiver country is in the zone
//         });

//         if (matchingZone) {
//           const { kg_prices } = matchingZone;
//           const matchingPrice = kg_prices.find((price: any) => {
//             return weight_kg >= price?.from_kg && weight_kg <= price?.to_kg; // Check if weight falls within range
//           });

//           if (matchingPrice) {
//             const orderPricing = matchingPrice?.price; // Set orderPricing based on matching price

//             const order = await orderModels.create({
//               sender,
//               receiver,
//               shipmentDetails,
//               shipmentMetrics,
//               userID,
//               agentID,
//               orderPricing,
//             });

//             user?.orders.push(new Types.ObjectId(order?._id!));
//             await user?.save();
//             agent?.orders.push(new Types.ObjectId(order?._id!));
//             await agent?.save();

//             return res.status(HTTPCODES.CREATED).json({
//               message: "Shipment Ordered",
//               status: "success",
//               data: order,
//             });
//           } else {
//             return next(
//               new MainAppError({
//                 message:
//                   "Shipment weight does not fall within any zone's price range",
//                 httpcode: HTTPCODES.BAD_REQUEST,
//               })
//             );
//           }
//         } else {
//           return next(
//             new MainAppError({
//               message:
//                 "Receiver country not covered by any of the agent's zones",
//               httpcode: HTTPCODES.BAD_REQUEST,
//             })
//           );
//         }
//       } else {
//         return next(
//           new MainAppError({
//             message:
//               "Account has not been verified yet or Agent has no zones defined.",
//             httpcode: HTTPCODES.BAD_REQUEST,
//           })
//         );
//       }
//     } catch (error: any) {
//       res.status(400).json({ message: error.message, error });
//       return next(
//         new MainAppError({
//           message: "An error occurred while booking shipment ",
//           httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// );

export const makeOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, agentID } = req.params;
      const { sender, receiver, shipmentDetails, shipmentMetrics } = req.body;
      const { weight_kg } = shipmentMetrics;

      // Log incoming data for debugging
      console.log("Incoming data:", {
        userID,
        agentID,
        sender,
        receiver,
        shipmentDetails,
        shipmentMetrics,
      });

      const user = await UserModel.findById(userID);
      const agent = await agentModel.findById(agentID).populate("agentZones");

      // Check if user and agent exist and have zones
      if (!user || !agent || agent.agentZones.length === 0) {
        return next(
          new MainAppError({
            message:
              "Account has not been verified yet or Agent has no zones defined.",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const matchingZone = agent.agentZones.find((zone: any) => {
        return zone.countries.includes(receiver.country);
      });

      if (!matchingZone) {
        return next(
          new MainAppError({
            message: "Receiver country not covered by any of the agent's zones",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const matchingPrice = matchingZone.kg_prices.find((price: any) => {
        return weight_kg >= price.from_kg && weight_kg <= price.to_kg;
      });

      if (!matchingPrice) {
        return next(
          new MainAppError({
            message:
              "Shipment weight does not fall within any zone's price range",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const orderPricing = matchingPrice.price;

      const order = await orderModels.create({
        sender,
        receiver,
        shipmentDetails,
        shipmentMetrics,
        userID,
        agentID,
        orderPricing,
      });

      user.orders.push(new Types.ObjectId(order._id));
      await user.save();
      agent.orders.push(new Types.ObjectId(order._id));
      await agent.save();

      return res.status(HTTPCODES.CREATED).json({
        message: "Shipment Ordered",
        status: "success",
        data: order,
      });
    } catch (error: any) {
      console.error("Error during order processing:", error); // Log the error for debugging
      if (!res.headersSent) {
        return res.status(400).json({ message: error.message, error });
      }
      return next(
        new MainAppError({
          message: "An error occurred while booking shipment",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const viewOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipments: any = await orderModels.find();
      return res.status(HTTPCODES.OK).json({
        No_Shipments: `${shipments.length}`,
        message: "All Shipments",
        data: shipments,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "An error occurred while viewing shipments",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderModels.find().populate("user").populate("agent");
    return res.status(HTTPCODES.OK).json({
      No_Shipments: `${orders.length}`,
      message: "All Shipments",
      data: orders,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message, error });
    return next(
      new MainAppError({
        message: "An error occurred while viewing shipments",
        httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
      })
    );
  }
};

export const deleteOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, shipmentID } = req.params;
      const user: any = await UserModel.findById(userID);
      const deletedOrder = await orderModels.findByIdAndDelete(shipmentID);

      if (!deletedOrder) {
        return res
          .status(HTTPCODES.BAD_REQUEST)
          .json({ message: "Order not found" });
      }

      user?.orders.pull(new Types.ObjectId(deletedOrder._id));
      await user.save();

      return res.status(HTTPCODES.OK).json({
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "An error occurred while viewing shipments",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const deleteOrderE = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, agentID, shipmentID } = req.params; // Assuming orderID is correct

      const user: any = await UserModel.findById(userID);
      const agent: any = await agentModel.findById(agentID);
      const deletedOrder: any = await orderModels
        .findById(shipmentID)
        .populate("user", "_id"); // Populate user for authorization

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if requesting user is the order owner or the assigned agent
      if (
        deletedOrder?.user._id.toString() !== userID &&
        deletedOrder?.agent._id.toString() !== agentID
      ) {
        return res
          .status(401)
          .json({ message: "Unauthorized to delete this order" });
      }

      user?.orders.pull(new Types.ObjectId(deletedOrder._id));
      await user.save();

      agent?.orders?.pull(new Types.ObjectId(deletedOrder._id));
      await agent?.save();

      return res.status(HTTPCODES.OK).json({
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      console.error(error); // Log the error for debugging
      res
        .status(HTTPCODES.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while deleting the order" });
    }
  }
);

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await orderModels
      .findById(id)
      .populate("user")
      .populate("agent");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Requested Order", data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;

    // Find all orders associated with the userID
    const orders = await orderModels.find({ userID });

    if (!orders || orders.length === 0) {
      return next(
        new MainAppError({
          message: "No orders found for this user.",
          httpcode: 404,
        })
      );
    }

    return res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  }
);

export const getUserCurrentOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;

    // Find the most recent order associated with the userID
    const currentOrder = await orderModels
      .findOne({ userID })
      .sort({ createdAt: -1 });

    if (!currentOrder) {
      return next(
        new MainAppError({
          message: "No current order found for this user.",
          httpcode: 404,
        })
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        order: currentOrder,
      },
    });
  }
);
