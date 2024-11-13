import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import ReturnObjectHandler from "../utilities/return.handler.utilities";
import User from "../models/user/user.model";
import UserService from "../services/user.services";
export default class UserController {
  /**
   * Handles the user login controller logic.
   *
   * @param req - The Express request object containing the user's login credentials.
   * @param res - The Express response object to send the login response.
   * @returns A Promise that resolves with the login response.
   */
  public static async userLoginController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        type: "error",
        message: "Email is required",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    if (!password) {
      return res.status(400).send({
        type: "error",
        message: "Password is required",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    const loginResult = await UserService.loginUserByEmail(email, password);

    if (loginResult.statusCode === 400) {
      return res.status(400).send({
        type: "error",
        message: "Email address is not valid",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }
    if (loginResult.getStatusCode() === 401) {
      return res.status(401).send({
        type: "error",
        message: "Invalid password",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }
    if (loginResult.getStatusCode() === 404) {
      return res.status(404).send({
        type: "error",
        message: "User not found",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    //Create token

    let token = null;
    try {
      token = jwt.sign(
        {
          value: loginResult.getReturnValue().userPublicId.userPublicId,
        },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        type: "system error",
        message:
          "An unexpected error occurred, we could not login you right now",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).send({
      type: "success",
      message: loginResult.getMessage(),
      data: {
        token,
      },
      timestamp: new Date().toUTCString(),
    });
  }

  public static async userRegisterController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        type: "error",
        message: "Email is required",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    if (!password) {
      return res.status(400).send({
        type: "error",
        message: "Password is required",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    const createdUserData = await UserService.registerUserByEmail(
      email,
      password
    );
    if (createdUserData.getStatusCode() === 400) {
      return res.status(400).send({
        type: "error",
        message: createdUserData.getMessage(),
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }
    if (createdUserData.getStatusCode() === 500) {
      return res.status(400).send({
        type: "error",
        message: "An error occurred on our side, we could not register you",
        data: {},
        timestamp: new Date().toUTCString(),
      });
    }

    //Filter data to return
    const newUserResponseDto = {
      user: {
        userId: createdUserData.getReturnValue().userPublicId.userPublicId,
      },
    };
    return res.status(200).send({
      type: "success",
      message: "User registered successfully",
      data: {
        user: newUserResponseDto.user,
      },
      timestamp: new Date().toUTCString(),
    });
  }
}
