import { Twitch } from "./Twitch";
import { User } from "../entity/User";
import { UserHelper } from "../helpers/UserHelper";
import { Mixer } from "./Mixer";

require("dotenv").config();
const DATABASE_SECRET = process.env.DATABASE_SECRET;

export class ServiceProcessor {
  static processFollowers = async (user: User) => {
    if (user.twitchId == null) return;
    const users = (await UserHelper.getAllUsers()).filter(
      (u) => u.twitchId != null
    );
    const userIds = users.map((u) => u.mixerId);
    const mapped = users.map((u) => ({ [u.mixerId]: u }));
    const usersObject = Object.assign({}, ...mapped);
    const followers = (await Mixer.getFollowers(user)).filter(
      (f) => f.id in userIds
    );

    for (const follow of followers) {
      try {
        const u = usersObject[follow.id];
        if (u.twitchId != null) {
          await Twitch.followStreamer(u, user);
        }
      } catch (e) {
        console.log(
          `Could not find registered user with Mixer Id ${follow.id} `
        );
      }
    }
    const follows = (await Mixer.getFollowing(user)).filter(
      (f) => f.id in userIds
    );
    for (const follow of follows) {
      try {
        const u = usersObject[follow.id];
        if (u.twitchId != null) {
          await Twitch.followStreamer(user, u);
        }
      } catch (e) {
        console.log(
          `Could not find registered user with Mixer Id ${follow.id} `
        );
      }
    }
  };
}
