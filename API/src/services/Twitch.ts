import TwitchClient, {
  AccessToken,
  HelixFollow,
  HelixSubscription,
  HelixPrivilegedUser,
} from "twitch";
import { EncryptionHelper } from "../helpers/EncryptionHelper";
import { User } from "../entity/User";
import { UserHelper } from "../helpers/UserHelper";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

require("dotenv").config();

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const DOMAIN = process.env.DOMAIN;
const DATABASE_SECRET = process.env.DATABASE_SECRET;

export class Twitch {
  static followStreamer = async (user: User, streamer: User) => {
    try {
      const twitchClient = await Twitch.getAdminTwitchClient(user);
      const twitchStreamer = await twitchClient.helix.users.getUserById(
        streamer.twitchId
      );
      await twitchStreamer.follow();
      return true;
    } catch (e) {
      return false;
    }
  };

  static async getUser(accessToken: string): Promise<HelixPrivilegedUser> {
    const twitchClient = await this.getUserTwitchClient(accessToken);
    return twitchClient.helix.users.getMe(false);
  }

  static async getToken(code: string, user: User = null) {
    const options: AxiosRequestConfig = {
      url: "https://id.twitch.tv/oauth2/token",
      method: "post",
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: DOMAIN + "/callback/twitch/admin",
      },
    };
    options["validateStatus"] = (status) => {
      return status >= 200 && status < 300; // default
    };
    const resp = await axios(options);
    if (user != null) {
      await Twitch.saveToken(user, resp);
    }
    return resp.data;
  }

  private static async getAdminTwitchClient(user: User) {
    const accessToken = EncryptionHelper.decrypt(
      user.twitchAccessToken,
      DATABASE_SECRET
    );
    const refreshToken = EncryptionHelper.decrypt(
      user.twitchRefreshToken,
      DATABASE_SECRET
    );
    return TwitchClient.withCredentials(
      CLIENT_ID,
      accessToken,
      ["channel:read:subscriptions"],
      {
        clientSecret: CLIENT_SECRET,
        refreshToken,
        onRefresh: (token: AccessToken) => {
          this.onRefresh(user, token);
        },
      }
    );
  }

  private static async getUserTwitchClient(accessToken: string) {
    return TwitchClient.withCredentials(CLIENT_ID, accessToken);
  }

  private static async onRefresh(user: User, accessToken: AccessToken) {
    user.twitchAccessToken = EncryptionHelper.encrypt(
      accessToken.accessToken,
      DATABASE_SECRET
    );
    user.twitchRefreshToken = EncryptionHelper.encrypt(
      accessToken.refreshToken,
      DATABASE_SECRET
    );
    await UserHelper.saveUser(user);
  }

  private static async paginateFollows(request) {
    let page: HelixFollow[];
    const result: HelixFollow[] = [];
    while ((page = await request.getNext()).length) {
      result.push(...page);
    }

    return result;
  }

  private static saveToken = async (
    user: User,
    resp: AxiosResponse
  ): Promise<string> => {
    if ("error" in resp) {
      console.warn(
        `Error in getting/refreshing token for ${user.mixerId}: ${resp["error"]}`
      );
      return null;
    }
    user.twitchAccessToken = EncryptionHelper.encrypt(
      resp.data["access_token"],
      DATABASE_SECRET
    );
    user.twitchRefreshToken = EncryptionHelper.encrypt(
      resp.data["refresh_token"],
      DATABASE_SECRET
    );
    await UserHelper.saveUser(user);
  };
}
