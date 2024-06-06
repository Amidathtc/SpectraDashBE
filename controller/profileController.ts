import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { streamUpload } from "../Utils/streamUpload";
import UserModel from "../model/userModel";
import ProfileModel from "../model/ProfileModel";

import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";

export const createProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {


    //order is going out soon 
    try {
      const { userID } = req.params;

      const { name, address, phoneNumber } = req.body;

      const { secure_url, public_id }: any = await streamUpload(req);

      const user: any = await UserModel.findById(userID);

      if (user) {
        const profiled = await ProfileModel.create({
          name,
          address,
          phoneNumber,
          userID,
          avatar: secure_url,
          avatarID: public_id,
        });
        user?.profile.push(new mongoose.Types.ObjectId(user._id!));
        user.save();
        return res.status(HTTPCODES.OK).json({
          message: "profile created",
          data: profiled,
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
          message: "An error occurred in while creating Profile ",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const viewUserProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;
      const user = await UserModel.findById(userID);
      if (user) {
        return res.status(HTTPCODES.OK).json({
          message: "User found",
          data: user?.profile,
        });
      } else {
        return next(
          new MainAppError({
            message: "user not found.",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
    } catch (error: any) {
      return next(
        new MainAppError({
          message: "An error occurred  while looking for user Profile ",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const ViewAll = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profiled = await ProfileModel.find();
      return res.status(HTTPCODES.OK).json({
        message: "User found",
        data: profiled,
      });
    } catch (error: any) {
      return next(
        new MainAppError({
          message: "users not found.",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

export const deleteOne = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { profileID } = req.params;
      const profiled = await ProfileModel.findByIdAndDelete(profileID);
      return res.status(HTTPCODES.OK).json({
        message: "Profile deleted",
        data: profiled,
      });
    } catch (error: any) {
      return next(
        new MainAppError({
          message: "Profile not deleted.",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

export const updateProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { profileID } = req.params;

      const { phoneNumber, address } = req.body;
      const profiled = await ProfileModel.findByIdAndUpdate(
        profileID,
        { phoneNumber, address },
        { new: true }
      );
      return res.status(HTTPCODES.OK).json({
        message: "Profile Updated",
        data: profiled,
      });
    } catch (error) {
      return next(
        new MainAppError({
          message: "Profile not upated.",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

export const getUserProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { profileID, userID } = req.params;
      const user: any = await UserModel.findById(userID);
      const profile: any = await ProfileModel.findById(profileID);
      if (user?._id === profile?.userID) {
        const profiled = await ProfileModel.find();

        return res.status(HTTPCODES.OK).json({
          message: "Profile Found",
          data: profiled,
        });
      } else {
        return next(
          new MainAppError({
            message: "User profile not found.",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
    } catch (error: any) {
      return next(
        new MainAppError({
          message: "Profile not found.",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);
