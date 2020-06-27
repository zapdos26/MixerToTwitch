import { Request, Response } from "express";
import { User } from "../entity/User";
import { ServiceProcessor } from "../services/ServiceProcessor";

export default class UserController {
  static getCurrentUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user: User = res.locals.user;
      res.send({
        mixerId: user.mixerId,
        twitchId: user.twitchId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  };

  static syncCurrentUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user: User = res.locals.user;
      await ServiceProcessor.processFollowers(user);
      res.send({
        mixerId: user.mixerId,
        synced: true,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e });
    }
  };
}
