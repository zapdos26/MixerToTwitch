import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { UserHelper } from "../helpers/UserHelper";

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

export class JWToken {
  static checkWebsiteJWT = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // Get the jwt token from the head
    const bearerHeader = req.headers["authorization"];
    let bearerToken: string;
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];
    } else {
      res
        .status(403)
        .send({ error: { message: "Missing authorization header" } });
      return;
    }
    let jwtPayload;
    // Try to validate the token and get data
    try {
      jwtPayload = jwt.verify(bearerToken, JWT_SECRET, { audience: "website" });
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      res.status(401).send(error);
      return;
    }

    const { mixerId } = jwtPayload;
    // The token is valid for 1 hour
    // We want to send a new token on every request
    console.log(mixerId);
    const newToken = jwt.sign({ mixerId }, JWT_SECRET, {
      expiresIn: "1h",
      audience: "website",
    });
    res.setHeader("token", newToken);
    res.setHeader("Access-Control-Expose-Headers", "token");
    console.log(req.path.toLowerCase());
    JWToken.storeUser(mixerId, res)
      .then((user) => {
        if (user == null) return;
        next();
      })
      .catch((e) => {
        console.log(e);
        res.status(404).send({
          error: {
            message: `Could not find token user with Mixer Id ${jwtPayload.mixerId}`,
          },
        });
      });
  };

  private static storeUser = async (
    mixerId: string,
    res: Response
  ): Promise<User> => {
    if (mixerId == null) {
      res
        .status(401)
        .send({ error: { message: "Invalid Token: No Mixer Id found" } });
      return;
    }
    const user: User = await UserHelper.getUserbyMixer(mixerId);
    res.locals.user = user;
    return user;
  };
}
