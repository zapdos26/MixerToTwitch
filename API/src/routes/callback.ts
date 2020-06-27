import { Router } from "express";
import AdministrationController from "../controllers/AdministrationController";
import { JWToken } from "../middlewares/JWToken";

const routerCallback = Router();

routerCallback.get(
  "/twitch",
  [JWToken.checkWebsiteJWT],
  AdministrationController.twitchCallback
);
routerCallback.get(
  "/mixer",
  [JWToken.checkWebsiteJWT],
  AdministrationController.mixerCallback
);

export default routerCallback;
