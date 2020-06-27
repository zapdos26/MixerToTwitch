import { Request, Response } from "express";
import { User } from "../entity/User";
import { AdministrationHelper } from "../helpers/AdministrationHelper";
import { UserHelper } from "../helpers/UserHelper";
import { Twitch } from "../services/Twitch";
import { ServiceProcessor } from "../services/ServiceProcessor";
import { Mixer } from "../services/Mixer";

class AdministrationController {
  static twitchCallback = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const code = <string>req.query.code;
      const user: User = res.locals.user;
      if (!AdministrationHelper.checkCallback(code, "twitch", res)) return;
      let token;
      try {
        token = await Twitch.getToken(code, user);
      } catch (e) {
        console.log(e);
        res.status(400).send({ error: { message: e.message } });
        return;
      }
      const twitchUser = await Twitch.getUser(token["access_token"]);
      user.twitchId = twitchUser.id;
      await UserHelper.saveUser(user);
      res.status(200).send({ success: true });
      await ServiceProcessor.processFollowers(user);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e });
    }
  };

  static mixerCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = <string>req.query.code;
      const user: User = res.locals.user;
      if (!AdministrationHelper.checkCallback(code, "mixer", res)) return;
      try {
        const token = await Mixer.getToken(code, user);
        user.mixerId = await Mixer.getCurrentUserId(token["access_token"]);
        await UserHelper.saveUser(user);
        res.status(200).send({ success: true });
        await ServiceProcessor.processFollowers(user);
      } catch (e) {
        console.log(e);
        res.status(400).send({ error: { message: e.message } });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e });
    }
  };
}

export default AdministrationController;
