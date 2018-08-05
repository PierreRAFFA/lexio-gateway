import { Request, Response } from "express";

export const read = (req: Request, res: Response) => {
  const major = 0;
  const minor = 5;
  const patch = 0;
  const version = major + '.' + minor + '.' + patch;
  const store = {
    apple: 'itms-apps:itunes.apple.com/app/lexio/id1286536739'
  };

  const maintenance = {
    enable: false,
    message: 'Sorry, Lexio is down for maintenance'
  };

  res.send({version, major, minor, patch, store, maintenance});
};
