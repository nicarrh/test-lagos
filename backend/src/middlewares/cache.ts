import { createCache } from "cache-manager";
import { NextFunction, Request, Response } from "express";

export const memoryCache = createCache({ ttl: 60 * 60 * 1000 * 24 });

export const intercepterCalls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("request", req.originalUrl);
  const data: any = await memoryCache.get(req.originalUrl);
  let parsed = JSON.parse(data);
  console.log("data cached", JSON.parse(data));
  if (data) {
    console.log("Cache hit", req.originalUrl);
    res.json(parsed);
    return;
  }
  next();
};
