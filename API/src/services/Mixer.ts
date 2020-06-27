// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Client,
  DefaultRequestRunner,
  OAuthProvider,
} from "@mixer/client-node";
import { User } from "../entity/User";
import { EncryptionHelper } from "../helpers/EncryptionHelper";
import { UserHelper } from "../helpers/UserHelper";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import MixerSubscription from "../types/MixerSubscription";
import MixerFollow from "../types/MixerFollow";
import { MixerUser } from "../types/MixerUser";

require("dotenv").config();

const CLIENT_ID = process.env.MIXER_CLIENT_ID;
const CLIENT_SECRET = process.env.MIXER_CLIENT_SECRET;

const DATABASE_SECRET = process.env.DATABASE_SECRET;

const DOMAIN = process.env.DOMAIN;

export class Mixer {
  static getCurrentUserId = async (accessToken: string): Promise<string> => {
    const options: AxiosRequestConfig = {
      url: "https://mixer.com/api/v1/oauth/token/introspect",
      method: "post",
      data: {
        token: accessToken,
      },
      headers: {
        "content-type": "application/json",
        "client-id": CLIENT_ID,
      },
    };
    options["validateStatus"] = (status) => {
      return status >= 200 && status < 300; // default
    };
    const resp = await axios(options);
    console.log(resp.data);
    return resp.data["sub"];
  };

  static getFollowers = async (user: User): Promise<MixerUser[]> => {
    const client = await Mixer.getAdminMixerClient(user);
    const channelId = await Mixer.getChannelId(user, client);
    return Mixer.paginateRequests(client, `channels/${channelId}/follow`);
  };

  static getFollowing = async (user: User): Promise<MixerFollow[]> => {
    const client = await Mixer.getUserMixerClient(
      EncryptionHelper.encrypt(user.accessToken, DATABASE_SECRET)
    );
    return Mixer.paginateRequests(client, `users/${user.mixerId}/follows`);
  };

  static getChannelId = async (
    user: User,
    client: Client = null
  ): Promise<number> => {
    if (client == null) {
      client = await Mixer.getUserMixerClient();
    }
    const resp = await client.request("GET", `users/${user.mixerId}`);
    return resp.body["channel"]["id"];
  };

  static getToken = async (
    code: string,
    user: User = null
  ): Promise<AxiosResponse.data> => {
    const options: AxiosRequestConfig = {
      url: "https://mixer.com/api/v1/oauth/token",
      method: "post",
      data: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${DOMAIN}/callback/mixer${user != null ? "/admin" : ""}`,
      },
      headers: {
        "content-type": "application/json",
      },
    };
    options["validateStatus"] = (status) => {
      return status >= 200 && status < 300; // default
    };
    const resp = await axios(options);
    if (user != null) {
      await Mixer.saveToken(user, resp);
    }
    return resp.data;
  };

  private static paginateRequests = async (
    client: Client,
    request: string
  ): Promise<MixerSubscription[] | MixerFollow[] | never[]> => {
    let page = 0;
    let results = [];
    let oldresultslength = 0;
    let items = 0;
    while (page === 0 || oldresultslength < results.length) {
      const response = await client.request("GET", request, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        qs: {
          page,
          limit: 100,
          noCount: true,
        },
      });
      if (response.statusCode !== 200) {
        return response;
      }
      if (items === 0) {
        items = response.headers["x-total-count"];
      }
      oldresultslength = results.length;
      results = [...results, ...response.body];
      page += 1;
    }
    return results;
  };

  private static getAdminMixerClient = async (user: User): Promise<Client> => {
    const client = new Client(new DefaultRequestRunner());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.use(
      new OAuthProvider(client, {
        clientId: CLIENT_ID,
        secret: CLIENT_SECRET,
        tokens: {
          access: EncryptionHelper.decrypt(
            user.mixerAccessToken,
            DATABASE_SECRET
          ),
          refresh: EncryptionHelper.decrypt(
            user.mixerRefreshToken,
            DATABASE_SECRET
          ),
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        },
      })
    );
    const provider = client.getProvider();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await provider.refresh();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.mixerAccessToken = EncryptionHelper.encrypt(
      provider.accessToken(),
      DATABASE_SECRET
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.mixerRefreshToken = EncryptionHelper.encrypt(
      provider.refreshToken(),
      DATABASE_SECRET
    );
    await UserHelper.saveUser(user);
    return client;
  };

  private static getUserMixerClient = async (
    accessToken: string = null
  ): Promise<Client> => {
    const client = new Client(new DefaultRequestRunner());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.use(
      new OAuthProvider(client, {
        clientId: CLIENT_ID,
        tokens: {
          access: accessToken,
          expires: Date.now() + 60 * 1000,
        },
      })
    );
    return client;
  };

  private static saveToken = async (
    user: User,
    resp: AxiosResponse
  ): Promise<string> => {
    if ("error" in resp) {
      console.warn(
        `Error in getting/refreshing token for ${user.discordId}: ${resp["error"]}`
      );
    }
    user.mixerAccessToken = EncryptionHelper.encrypt(
      resp.data["access_token"],
      DATABASE_SECRET
    );
    user.mixerRefreshToken = EncryptionHelper.encrypt(
      resp.data["refresh_token"],
      DATABASE_SECRET
    );
    await UserHelper.saveUser(user);
  };
}
