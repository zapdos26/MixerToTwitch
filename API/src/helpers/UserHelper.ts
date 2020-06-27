import { getRepository, InsertResult } from "typeorm";
import { User } from "../entity/User";

export class UserHelper {
  static getAllUsers = async (): Promise<User[]> => {
    return getRepository(User).find();
  };

  static getUserbyTwitch = async (
    twitchId: string,
    admin: boolean = null
  ): Promise<User> => {
    const conditions = { twitchId };
    if (admin != null) {
      conditions["admin"] = admin;
    }
    return getRepository(User).findOneOrFail(conditions, { cache: true });
  };

  static getUserbyMixer = async (
    mixerId: string,
    admin: boolean = null
  ): Promise<User> => {
    const conditions = { mixerId };
    if (admin != null) {
      conditions["admin"] = admin;
    }
    return getRepository(User).findOneOrFail(conditions, { cache: true });
  };

  static insertUser = async (user: User): Promise<InsertResult> => {
    return getRepository(User).insert(user);
  };

  static saveUser = async (user: User): Promise<User> => {
    return getRepository(User).save(user);
  };

  static publicUser = async (user: User): Promise<User> => {
    const userNew = new User();
    const keys = [
      "discordId",
      "minecraftId",
      "steamId",
      "patreonId",
      "twitchId",
      "mixerId",
      "youtubeId",
      "createdAt",
      "updatedAt",
    ];
    for (const key of keys) {
      userNew[key] = user[key];
    }
    return userNew;
  };

  static publicAdmin = async (admin: User): Promise<User> => {
    const adminNew = await UserHelper.publicUser(admin);
    adminNew["admin"] = admin["admin"];
    const keys = [
      "patreonAccessToken",
      "twitchAccessToken",
      "mixerAccessToken",
    ];
    for (const key of keys) {
      if (admin[key] != null) {
        adminNew[key] = 1;
      } else {
        adminNew[key] = 0;
      }
    }
    return adminNew;
  };
}
