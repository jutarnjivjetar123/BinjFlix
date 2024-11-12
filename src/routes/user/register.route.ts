import { Router, Response, Request } from "express";
import UserController from "../../controllers/user.controller";

class RegisterRoute {
  router = Router();
  constructor() {
    this.routes();
  }
  routes() {
    this.router.post("/register", async (req: Request, res: Response) => {
      const controllerResponse = await UserController.userRegisterController(
        req,
        res
      );

      return controllerResponse;
    });
  }
}

export default new RegisterRoute().router;
