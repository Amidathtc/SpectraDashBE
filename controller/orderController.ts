import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import UserModel from "../model/userModel";
import orderModels from "../model/OrdersModel";
import agentModel from "../model/AgentModel";

export const makeOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, agentID } = req.params;
      const { sender, receiver, shipmentDetails, shipmentMetrics } = req.body;
      const { weight_kg } = shipmentMetrics; // Assuming weight is a property in shipmentMetrics

      const user = await UserModel.findById(userID);
      const agent = await agentModel.findById(agentID).populate("agentZones"); // Populate agentZones

      if (user && agent && agent?.agentZones.length > 0) {
        const matchingZone = agent?.agentZones.find((zone) => {
          const { countries } = zone;
          return countries.includes(receiver?.country); // Check if receiver country is in the zone
        });

        if (matchingZone) {
          const { kg_prices } = matchingZone;
          const matchingPrice = kg_prices.find((price) => {
            return weight_kg >= price?.from_kg && weight_kg <= price?.to_kg; // Check if weight falls within range
          });

          if (matchingPrice) {
            const orderPricing = matchingPrice?.price; // Set orderPricing based on matching price

            const order = await orderModels.create({
              sender,
              receiver,
              shipmentDetails,
              shipmentMetrics,
              user,
              agent,
              orderPricing,
            });

            await user?.orders.push(new Types.ObjectId(order?._id!));
            await user?.save();
            await agent?.orders.push(new Types.ObjectId(order?._id!));
            await agent?.save();

            return res.status(HTTPCODES.OK).json({
              message: "Shipment Ordered",
              data: order,
            });
          } else {
            return next(
              new MainAppError({
                message:
                  "Shipment weight does not fall within any zone's price range",
                httpcode: HTTPCODES.BAD_REQUEST,
              })
            );
          }
        } else {
          return next(
            new MainAppError({
              message:
                "Receiver country not covered by any of the agent's zones",
              httpcode: HTTPCODES.BAD_REQUEST,
            })
          );
        }
      } else {
        return next(
          new MainAppError({
            message:
              "Account has not been verified yet or Agent has no zones defined.",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "An error occurred while booking shipment ",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
