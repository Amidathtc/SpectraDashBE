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

      const user: any = await UserModel.findById(userID);
      const agent: any = await agentModel.findById(agentID);

      if (user && agent) {
        const order = await orderModels.create({
          sender,
          receiver,
          shipmentDetails,
          shipmentMetrics,
          user: user,
          agent: agent,
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
            message: "Account has not been verified yet.",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
    } catch (error: any) {
      return next(
        new MainAppError({
          message: "An error occurred in while booking shipment ",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
