import { validateAccessToken } from "../auth";
import { ExpressContext } from "../interfaces/req-res";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ExpressContext> = ({ context }, next) => {
  const auth = context.req.headers["authorization"];
  if (!auth) throw new Error("not authenticated");
  try {
    const token = auth.split(" ")[1];
    // console.log("token:", token);
    if (!token) throw new Error("not valid token");
    const payloadjwt = validateAccessToken(token);
    context.payload = payloadjwt as any;
  } catch (err) {
    // console.log(err);
    throw new Error("not valid token");
  }
  return next();
};
