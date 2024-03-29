import { Request, Response } from "express";

export interface ExpressContext {
  req: Request;
  res: Response;
  payload?: { UserId: number };
}
