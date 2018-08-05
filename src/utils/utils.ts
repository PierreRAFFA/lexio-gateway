import { LexioRequest } from "lexio";

export function getApiVersion(req: LexioRequest): string {
  return req.params.apiVersion || req.headers.apiversion;
}
