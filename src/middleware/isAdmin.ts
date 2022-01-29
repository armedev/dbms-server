import { ExpressContext } from "../interfaces/req-res";
import { MiddlewareFn } from "type-graphql";
import ps from "../prisma-client";

export const isAdmin: MiddlewareFn<ExpressContext> = async (
  { context },
  next
) => {
  if (!context.payload) throw new Error("not logged in");
  // console.log(context.payload.UserId);
  try {
    const user = await ps.user.findUnique({
      where: { id: context.payload.UserId },
    });
    if (!user || !user.admin) throw new Error("Not admin");
  } catch (err) {
    console.log(err);
    throw new Error("not admin");
  }
  return next();
};
