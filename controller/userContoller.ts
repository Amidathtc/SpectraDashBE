import { NextFunction, Response, Request } from "express";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import UserModels from "../model/userModel";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../Utils/email";
import { EnvironmentVariables } from "../config/envV";
import { sessionStore } from "../interface/interface";
import session from "express-session";
import { config } from "dotenv";
import { Types } from "mongoose";
import ProfileModel from "../model/ProfileModel";
config();

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
      const { firstName, lastName, email, password } = req.body;

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTPCODES.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      // Check if admin already exists
      const existingUser = await UserModels.findOne({ email });
      if (existingUser) {
        return next(
          new MainAppError({
            message: "User already exists",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const salt = await bcrypt.genSalt(10);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, salt);
      // const value = crypto.randomBytes(10).toString("hex");
      // const token = jwt.sign(value, "justRand" )
      const initialAvatar = firstName.charAt() + lastName.charAt();

      // Create new user
      const User: any = await UserModels.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        avatar: initialAvatar,
      });
      const userProfile: any = await ProfileModel.create({
        firstName: User?.firstName,
        lastName: User?.lastName,
        password: User?.password,
        profileAvatar: User?.avatar,
        userID: User?._id,
      });

      await User.profile.push(new Types.ObjectId(User?._id));
      await User.save();
      await userProfile.save();
      // const tokenID = jwt.sign({id: User.id}, "justRand")
      await sendMail(User);

      return res.status(HTTPCODES.OK).json({
        message: `${User?.firstName} ~ your account has being created successfully`,
        data: User,
        profileData: userProfile,
      });
    } catch (error: any) {
      return res.status(HTTPCODES.OK).json({
        errorMessage: `${error.message}`,
        errorStack: error,
      });
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

      // Configure express-session middleware
      req.app.use(
        session({
          /* Configure session options here */
          secret: EnvironmentVariables.Session_Secret,
          resave: false,
          saveUninitialized: true,
          store: sessionStore,
          cookie: {
            // maxAge: 1000 * 60 * 24 * 60,
            sameSite: "lax",
            secure: false,
          },
        })
      );

      req.session.userId = user._id; // Store only user ID in session

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return res.status(HTTPCODES.OK).json({
        message: "Login successful",
        data: { token }, // Return only the JWT token
      });
    } catch (error: any) {
      console.error(error); // Log the actual error
      console.error(error.message); // Log the actual error
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

export const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await UserModels.findByIdAndDelete(userID);

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
