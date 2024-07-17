import { NextFunction, Request, Response } from "express";
import UserModel from "../model/userModel";
import ProfileModel from "../model/ProfileModel";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import cloudinary from "../config/cloudinary";
import { Types } from "mongoose";

export const viewUserProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;

      // Find the matching profile based on userID using the index
      const userProfile = await ProfileModel.findOne({ user: userID });

      if (!userProfile) {
        return next(
          new MainAppError({
            message: "User profile not found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }

      return res.status(HTTPCODES.OK).json({
        message: "User profile",
        data: userProfile,
      });
    } catch (error: any) {
      console.error(error);
      return next(
        new MainAppError({
          message: "An error occurred while looking for user profile",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const ViewAllProfiles = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profiled = await ProfileModel.find();
      return res.status(HTTPCODES.OK).json({
        message: "All User Profiles",
        data: profiled,
      });
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
      return next(
        new MainAppError({
          message: "All User Profiles not found.",
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

      const { password } = req.body;
      const profiled = await ProfileModel.findByIdAndUpdate(
        profileID,
        { password },
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

export const updateProfileAvatar = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { userID, profileID } = req.params;

      // if (!name || !address || !phoneNumber) {
      //   throw new MainAppError({
      //     message: "Missing required fields in request body",
      //     httpcode: HTTPCODES.BAD_REQUEST,
      //   });
      // }

      // Upload the profile image using streamUpload
      const { secure_url } = await cloudinary.uploader.upload(req.file.path);

      // Find the user by ID
      const user = await UserModel.findById(userID);

      // Check if user exists and is verified
      if (!user || !user.verified) {
        throw new MainAppError({
          message: "User not found or account not verified",
          httpcode: HTTPCODES.BAD_REQUEST,
        });
      }

      // Create the profile
      const profiled: any = await ProfileModel.findByIdAndUpdate(
        profileID,
        {
          avatar: secure_url,
        },
        { new: true }
      );

      // Update user's profile reference (assuming a single profile per user)
      user.profile = profiled._id;
      await user?.save();

      res.status(HTTPCODES.OK).json({
        message: "Profile Updated successfully",
        data: profiled,
      });
    } catch (error: any) {
      // Handle errors more gracefully
      console.error("Error updating profile:", error);
      next(
        new MainAppError({
          message: "An error occurred while creating the profile",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
          // errorDetails: error.message, // Consider including relevant error details for debugging
        })
      );
    }
  }
);

export const deleteOne = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, profileID } = req.params;
      const user: any = await UserModel.findById(userID);
      if (user) {
        const profiled: any = await ProfileModel.findByIdAndDelete(profileID);

        await user?.profile.pull(new Types.ObjectId(profiled));
        await user?.save();

        return res.status(HTTPCODES.OK).json({
          message: "Profile deleted",
        });
      } else {
        return res.status(HTTPCODES.OK).json({
          message: "Profile deleted",
        });
      }
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
