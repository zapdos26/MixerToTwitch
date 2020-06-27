import { Request, Response } from "express";
import { User } from "../entity/User";
import { AdministrationHelper } from "../helpers/AdministrationHelper";
import { UserHelper } from "../helpers/UserHelper";
import { Twitch } from "../services/Twitch";
import { Mixer } from "../services/Mixer";
import AccessToken from "../types/AccessToken";
import { EncryptionHelper } from "../helpers/EncryptionHelper";
import { TokenHelper } from "../helpers/TokenHelper";

require("dotenv").config();

const DATABASE_SECRET = process.env.DATABASE_SECRET;

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
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  };

  static mixerCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = <string>req.query.code;
      if (!AdministrationHelper.checkCallback(code, "mixer", res)) return;
      let token: Object;
      try {
        token = await Mixer.getToken(code);
        const mixerId = await Mixer.getCurrentUserId(token["access_token"]);
        let user: User;
        try {
          user = await UserHelper.getUserbyMixer(mixerId);
        } catch (e) {
          user = new User();
          user.mixerId = mixerId;
        }
        user.mixerAccessToken = EncryptionHelper.encrypt(
          token["access_token"],
          DATABASE_SECRET
        );
        user.mixerRefreshToken = EncryptionHelper.encrypt(
          token["refresh_token"],
          DATABASE_SECRET
        );
        user = await UserHelper.saveUser(user);
        const websiteToken = TokenHelper.generateWebsiteAccessToken(
          user.mixerId
        );
        res.setHeader("token", websiteToken);
        res.setHeader("Access-Control-Expose-Headers", "token");
        res.status(200).send({ success: true });
      } catch (e) {
        console.log(e);
        res.status(400).send({ message: e.message });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e.message });
    }
  };
}

export default AdministrationController;
