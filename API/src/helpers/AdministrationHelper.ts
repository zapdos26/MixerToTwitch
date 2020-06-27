import { Response } from "express";

export class AdministrationHelper {
  static checkCallback = (
    code: string,
    service: string,
    res: Response
  ): boolean => {
    if (code == null) {
      res.status(400).send({ error: { message: "No code provided" } });
      return false;
    }
    return true;
  };
}
