import { Request } from "express";

export interface LexioRequest extends Request {
  user: object;
}

export interface LexioError extends Error {
  statusCode: number;
}

export interface ApiVersions {
  [key: string]: IApiServices;
}

export interface IApiServices {
  [key: string]: string;
}
