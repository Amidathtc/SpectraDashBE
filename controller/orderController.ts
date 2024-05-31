import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import UserModel from "../model/userModel";
import orderModels from "../model/OrdersModel";

export const makeOrder = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;

      const { sender, receiver, shipmentDetails } = req.body;

      const user: any = await UserModel.findById(userID);

      if (user) {
        const order = await orderModels.create({
          sender,
          receiver,
          shipmentDetails,
          user: user,
        });
        user?.orders.push(new Types.ObjectId(order._id!));
        user?.save();
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
