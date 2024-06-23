import { NextFunction, Response, Request } from "express";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import AgentModel from "../model/AgentModel";
import { validationResult } from 'express-validator';
import bcrypt from "bcryptjs" 
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../Utils/email";


export const ViewAllAgent = AsyncHandler(
    async (req: Request, res: Response) => {
      try {
        // const users = await clientModels.find().populate("ShipmentHistory");
        const agents = await AgentModel.find();
        return res.status(HTTPCODES.OK).json({
          length: agents?.length,
          message:
            agents?.length === 0
              ? "No Available Agent yet"
              : "All Agents successfully gotten",
          data: agents,
        });
      } catch (error) {
        return res.status(HTTPCODES.BAD_REQUEST).json({
          message: "An Error Occured View All Users",
          error: error,
        });
      }
    }
  );

  export const loginAgent = AsyncHandler(
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
  
        const { AgentEmail ,password } = req.body;
        const getAgent = await AgentModel.findOne({
          AgentEmail,
        }).select('+password');
  
        if (!getAgent) {
          return next(
            new MainAppError({
              message: 'Agent not found for the provided email address.',
              httpcode: HTTPCODES.BAD_REQUEST,
            })
          );
        }
  
        const isPasswordValid = await bcrypt.compare(password, getAgent.password);
        if (!isPasswordValid) {
          if (getAgent.verified) {
            const encrypt = jwt.sign(
              { id: getAgent._id },
              process.env.JWT_SECRET!,
              {
                expiresIn: '1d',
              }
            );
  
            req.session.isAuth = true;
            req.session.userID = getAgent._id;
  
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
        req.session.user = getAgent._id;
  
        return res.status(HTTPCODES.OK).json({
          message: 'Login Successful',
          data: getAgent._id,
        });
      } catch (error) {
        return res.status(HTTPCODES.BAD_REQUEST).json({
          message: 'An Error Occured in loginAgent/',
          error: error,
        });
      }
    },
  );

  export const createAgent = AsyncHandler(     
    async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { AgentEmail, password, AgentCompanyname } = req.body;
  
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTPCODES.BAD_REQUEST).json({ errors: errors.array() });
      }
  
      // Check if admin already exists
      const existingAgent = await AgentModel.findOne({ AgentEmail });
      if (existingAgent) {
        return next(new MainAppError({
          message: 'Agent already exists',
          httpcode: HTTPCODES.BAD_REQUEST,
        }));
      }
  
      const salt = await bcrypt.genSalt(10);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, salt);
  // const value = crypto.randomBytes(10).toString("hex");
  // const token = jwt.sign(value, "justRand" )
  
  
      // Create new admin
      const  Agent = await AgentModel.create({
        AgentCompanyname,
        AgentEmail,
        password: hashedPassword,
        // token
      });
  
      // const tokenID = jwt.sign({id: User.id}, "justRand")
      sendMail(Agent)
  
  
      return res.status(HTTPCODES.OK).json({
        message: `${Agent?.AgentCompanyname} ~ your account has being created successfully`,
        data: Agent ,
      });
    } catch (error:any) {
      return next(new MainAppError({
        message: 'An error occurred in while creating Agent',
        httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
      }));
    }
  });

  export const logoutAgent = AsyncHandler((req: any, res: Response, next: NextFunction) => {
    try {
      req.session.destroy();
  
      res.status(HTTPCODES.OK).json({
        message: 'Logout Successful',
      });
    } catch (error:any) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: 'An Error Occured in logoutAgent',
        error: error,
      });
    }
  });

  export const getAgent = AsyncHandler(async (req: Request, res: Response) => {
    try {
      const { AgentID } = req.params;
      const Agent = await AgentModel.findById(AgentID);
  
      return res.status(HTTPCODES.OK).json({
        data: Agent,
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

  export const deleteAgent = AsyncHandler(async (req: Request, res: Response) => {
    try {
      const { AgentID } = req.params;
      const agent = await AgentModel.findByIdAndDelete(AgentID);
  
      return res.status(HTTPCODES.OK).json({
        message: `${agent?.AgentCompanyname} account has being deleted`,
      });
    } catch (error: any) {
      if (error.path === "_id") {
        return res.status(HTTPCODES.NOT_FOUND).json({
          message: "An Error Occured in getAgent(id)",
        });
      }
      return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
        message: "An Error Occured in getAgent",
        error: error?.message,
      });
    }
  });

  export const updateAgent = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { AgentID } = req.params;
    const { AgentCompanyname, password, AgentEmail } = req.body;
    const getAgent = await AgentModel.findById(AgentID);
    await AgentModel.findByIdAndUpdate(getAgent?._id, {
        AgentCompanyname   ,
      AgentEmail,
      password,
    });
    return res.status(HTTPCODES.OK).json({
      message: "Udated",
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAgent(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in upateAgent",
      error: error?.message,
    });
  }
});


export const verifyAgent = async (req: Request, res: Response) => {
    try {
      const { AgentID } = req.params;
  
      await AgentModel.findByIdAndUpdate(
        AgentID,
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