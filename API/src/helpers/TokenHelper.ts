import * as jwt from "jsonwebtoken";

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

export class TokenHelper {
  static generateWebsiteAccessToken = (mixerId: string): string => {
    return jwt.sign({ mixerId }, JWT_SECRET, {
      expiresIn: "1h",
      audience: "website",
    });
  };
  static verifyWebsiteAccessToken = (token: string): string | object => {
    return jwt.verify(token, JWT_SECRET, { audience: "website" });
  };
}
