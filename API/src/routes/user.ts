import { Router } from "express";
import UserController from "../controllers/UserController";
import { JWToken } from "../middlewares/JWToken";

const routerUser = Router();

routerUser.get(
  "/user/current",
  [JWToken.checkWebsiteJWT],
  UserController.getCurrentUser
);
routerUser.get(
  "/sync/current",
  [JWToken.checkWebsiteJWT],
  UserController.syncCurrentUser
);

export default routerUser;
