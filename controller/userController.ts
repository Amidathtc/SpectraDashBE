import express, { NextFunction, Response, Request } from "express";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import UserModels, { UserSchema } from "../model/userModel";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EnvironmentVariables } from "../config/envV";
import { sessionStore } from "../interface/interface";
import session from "express-session";
import { config } from "dotenv";
import { Types } from "mongoose";
import ProfileModel from "../model/ProfileModel";
// import { sendMail } from "../Utils/email1";
import { sendMail } from "../Utils/email";
config();

const app = express();
// Configure session middleware globally
app.use(
  session({
    secret: EnvironmentVariables.Session_Secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      // Configure maxAge (in milliseconds) for session expiration (optional)
      maxAge: 1000 * 60 * 60 * 24, // One day
      sameSite: "lax",
      secure: false,
    },
  })
);

export const viewAllUsers = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      // const users = await clientModels.find().populate("ShipmentHistory");
      const users = await UserModels.find();
      return res.status(HTTPCODES.OK).json({
        length: users?.length,
        message:
          users?.length === 0
            ? "No Available Users yet"
            : "All Users successfully gotten",
        data: users,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "An Error Occured View All Users",
        error: error,
      });
    }
  }
);

export const createUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body; // Validate input

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTPCODES.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      const existingUser = await UserModels.findOne({ email });
      if (existingUser) {
        return next(
          new MainAppError({
            message: "User already exists",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
      let tfirstName = firstName.trim();
      let tlastName = lastName.trim();
      let temail = email.trim();
      let tpassword = password.trim();

      const salt = await bcrypt.genSalt(10); // Hash the password
      const hashedPassword = await bcrypt.hash(tpassword, salt);
      const initialAvatar = firstName.charAt() + lastName.charAt(); // Create new user avatar initials

      const user: any = await UserModels.create({
        firstName: tfirstName,
        lastName: tlastName,
        email: temail,
        password: hashedPassword,
        avatar: initialAvatar,
      });
      const profile: any = await ProfileModel.create({
        firstName: user?.firstName,
        lastName: user?.lastName,
        profileAvatar: user?.avatar,
        user: user?._id,
      });

      await user.profile.push(new Types.ObjectId(user?._id));
      await user?.save();
      await profile?.save();

      // await sendMail(user);
      await sendMail(user);

      return res.status(HTTPCODES.OK).json({
        status:"success",
        message: `${user?.firstName} ~ your account has being created successfully`,
        data: user,
      });
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
      return next(
        new MainAppError({
          message: "An error occurred in while creating user",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const loginUser = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new MainAppError({
            message: "Invalid input data",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const { email, password } = req.body;
      const user = await UserModels.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new MainAppError({
            message: "User not found",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        if (!user.verified) {
          return next(
            new MainAppError({
              message: "Account not verified",
              httpcode: HTTPCODES.UNAUTHORIZED,
            })
          );
        } else {
          return next(
            new MainAppError({
              message: "Invalid credentials",
              httpcode: HTTPCODES.UNAUTHORIZED,
            })
          );
        }
      }

      req.session.userId = user._id; // Store only user ID in session

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return res.status(HTTPCODES.OK).json({
        message: "Login successful",
        data: { token }, // Return only the JWT token
      });
    } catch (error: any) {
      console.error("Error during login:", error); // Log the actual error
      return res
        .status(HTTPCODES.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred" });
    }
  }
);

export const lginUser = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      // Validate input data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new MainAppError({
            message: "Invalid input data",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const { email, password } = req.body;

      // Find user with email and include password field for comparison
      const user = await UserModels.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new MainAppError({
            message: "User not found",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      // Compare password hashes securely using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        if (!user.verified) {
          return next(
            new MainAppError({
              message: "Account not verified",
              httpcode: HTTPCODES.UNAUTHORIZED,
            })
          );
        } else {
          return next(
            new MainAppError({
              message: "Invalid credentials",
              httpcode: HTTPCODES.UNAUTHORIZED,
            })
          );
        }
      }

      // Configure session (replace with your actual session store configuration)
      const session = req.app.locals.session; // Assuming session middleware is configured elsewhere

      if (!session) {
        throw new Error("Session middleware not configured!"); // Handle missing session middleware
      }

      req.session.userId = user._id; // Store only user ID in session for security

      // Generate JWT token with appropriate expiration time
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return res.status(HTTPCODES.OK).json({
        message: "Login successful",
        data: { token }, // Return only the JWT token
      });
    } catch (error: any) {
      console.error(error); // Log the actual error
      return res
        .status(HTTPCODES.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred" });
    }
  }
);

export const logoutUser = AsyncHandler(
  (req: any, res: Response, next: NextFunction) => {
    try {
      req.session.destroy();

      res.status(HTTPCODES.OK).json({
        message: "Logout Successful",
      });
    } catch (error: any) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "An Error Occured in logoutUser",
        error: error,
      });
    }
  }
);

export const getUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await UserModels.findById(userID);

    return res.status(HTTPCODES.OK).json({
      data: user,
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAdmin(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in getAdmin",
      error: error?.message,
    });
  }
});

// User Schema (assuming 'UserSchema' is already defined)
UserSchema.pre("deleteOne", { document: true }, async function (next) {
  const user = this; // refers to the user document being deleted
  try {
    await ProfileModel.findByIdAndDelete(user._id); // Delete associated profile
    next();
  } catch (error: any) {
    console.error("Error deleting associated profile:", error);
    next(error); // Pass the error to the main error handler
  }
});

export const deleteUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;
      console.log("Deleting user with ID:", userID);

      // Delete user (cascading delete will handle profile)
      const user = await UserModels.findByIdAndDelete(userID);

      if (!user) {
        return next(
          new MainAppError({
            message: "User not found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }

      return res.status(HTTPCODES.OK).json({
        message: `${user.firstName} account has been deleted`,
      });
    } catch (error: any) {
      console.error(error);
      return next(
        new MainAppError({
          message: "An error occurred while deleting user",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const deleteAUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user: any = await UserModels.findByIdAndDelete(userID);
    //     const userProfile: any = await ProfileModel.findByIdAndDelete();

    //     await user.profile.pull(new Types.ObjectId(userID));
    //     await User.save();
    //     await userProfile.save();
    return res.status(HTTPCODES.OK).json({
      message: `${user?.firstName} account has being deleted`,
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAdmin(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in getAdmin",
      error: error?.message,
    });
  }
});

export const updateUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { firstName, lastName, password, email } = req.body;
    const getUser = await UserModels.findById(userID);
    const updates = await UserModels.findByIdAndUpdate(
      getUser?._id,
      {
        firstName,
        lastName,
        email,
        password,
      },
      { new: true }
    );

    return res.status(HTTPCODES.OK).json({
      message: "Updated",
      data: updates,
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAdmin(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in upateAdmin",
      error: error?.message,
    });
  }
});

export const verifyUsers = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    await UserModels.findByIdAndUpdate(
      userID,
      {
        verified: true,
      },
      { new: true }
    );

    return res.status(HTTPCODES.OK).json({
      message: "user has been verified",
      status: 201,
    });
  } catch (error) {
    return res.status(HTTPCODES.NOT_FOUND).json({
      message: "Error",
      status: 404,
    });
  }
};
