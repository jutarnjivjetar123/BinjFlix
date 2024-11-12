import { Router, Request, Response } from "express";
import UserController from "../../controllers/user.controller";

class LoginRoute {
  router = Router();

  /**
   *
   */
  constructor() {
    this.routes();
  }

  routes() {
    this.router.post("/login", (req: Request, res: Response) => {
      //Controller for user login

      const loginControllerResponse = UserController.userLoginController(
        req,
        res
      );

      return loginControllerResponse;
    });
  }
}

export default new LoginRoute().router;
