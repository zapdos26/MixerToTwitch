import { Router } from "express";
import routerUser from "./user";
import routerCallback from "./callback";

const routes = Router();

routes.use("/users", routerUser);
routes.use("/callback", routerCallback);

export default routes;
