import { NextFunction, Response, Request } from "express";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import UserModels from "../model/userModel";
import { validationResult } from 'express-validator';
import bcrypt from "bcryptjs" 
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../Utils/email";
import userRoute from "../routes/userRoute";

export const ViewAllUsers = AsyncHandler(
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
    const { name, email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPCODES.BAD_REQUEST).json({ errors: errors.array() });
    }

    // Check if admin already exists
    const existingUser = await UserModels.findOne({ email });
    if (existingUser) {
      return next(new MainAppError({
        message: 'User already exists',
        httpcode: HTTPCODES.BAD_REQUEST,
      }));
    }

    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
const value = crypto.randomBytes(10).toString("hex");
const token = jwt.sign(value, "justRand" )


    // Create new admin
    const  User = await UserModels.create({
      name,
      email,
      password: hashedPassword,
      token
    });

    const tokenID = jwt.sign({id: User.id}, "justRand")
    sendMail(User,tokenID);


    return res.status(HTTPCODES.OK).json({
      message: `${User?.name} ~ your account has being created successfully`,
      data: User ,
    });
  } catch (error:any) {
    return next(new MainAppError({
      message: 'An error occurred in while creating user',
      httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
    }));
  }
});

export const loginUser = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new MainAppError({
            message: 'Invalid input data',
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const { email, password } = req.body;
      const getUser = await UserModels.findOne({
        email,
      }).select('+password');

      if (!getUser) {
        return next(
          new MainAppError({
            message: 'User not found for the provided email address.',
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      const isPasswordValid = await bcrypt.compare(password, getUser.password);
      if (!isPasswordValid) {
        if (getUser.verified) {
          const encrypt = jwt.sign(
            { id: getUser._id },
            process.env.JWT_SECRET!,
            {
              expiresIn: '1d',
            }
          );

          req.session.isAuth = true;
          req.session.userID = getUser._id;

          return res.status(HTTPCODES.OK).json({
            message: 'welcome back',
            data: encrypt,
          });
        } else {
          return next(
            new MainAppError({
              message: 'Account has not been verified yet.',
              httpcode: HTTPCODES.BAD_REQUEST,
            })
          );
        }
      }

      // Set session data here
      req.session.user = getUser._id;

      return res.status(HTTPCODES.OK).json({
        message: 'Login Successful',
        data: getUser._id,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: 'An Error Occured in loginUser',
        error: error,
      });
    }
  },
);

export const logoutUser = AsyncHandler((req: any, res: Response, next: NextFunction) => {
  try {
    req.session.destroy();

    res.status(HTTPCODES.OK).json({
      message: 'Logout Successful',
    });
  } catch (error:any) {
    return res.status(HTTPCODES.BAD_REQUEST).json({
      message: 'An Error Occured in logoutUser',
      error: error,
    });
  }
});

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

export const updateUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { name, password, email } = req.body;
    const getUser = await UserModels.findById(userID);
    await UserModels.findByIdAndUpdate(getUser?._id, {
      name,
      email,
      password,
    });
    return res.status(HTTPCODES.OK).json({
      message: "Udated",
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
        verify: true,
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