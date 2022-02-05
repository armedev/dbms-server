// import { Collection } from ".prisma/client";
import { isAuth } from "../middleware/isAuth";
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import User from "./user";
import Collection from "./collections";
import ps from "../prisma-client";

@ObjectType()
export default class Orders {
  @Field((_type) => Int)
  offeredById: number;

  @Field((_type) => User)
  offeredBy: User;

  @Field((_type) => Int)
  toCollectioId: number;

  @Field((_type) => Collection)
  toCollection: Collection;

  @Field((_type) => Int)
  price: number;
}

@Resolver()
export class OrdersResolver {
  @Query((_returns) => [Orders])
  @UseMiddleware([isAuth])
  async allOrders() {
    return await ps.orders.findMany({
      include: {
        offeredBy: {
          select: {
            email: true,
            name: true,
          },
        },
        toCollection: {
          select: {
            name: true,
            price: true,
            primaryPic: true,
          },
        },
      },
    });
  }

  @Mutation((_type) => Boolean)
  @UseMiddleware([isAuth])
  async deleteOrder(
    @Arg("collectionId", (_type) => Int) collectionId: number,
    @Arg("userId", (_type) => Int) userId: number
  ) {
    try {
      await ps.orders.delete({
        where: {
          offeredById_toCollectioId: {
            offeredById: userId,
            toCollectioId: collectionId,
          },
        },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_type) => Boolean)
  @UseMiddleware([isAuth])
  async updateOrderPrice(
    @Arg("collectionId", (_type) => Int) collectionId: number,
    @Arg("userId", (_type) => Int) userId: number,
    @Arg("price", (_type) => Int) price: number
  ) {
    try {
      await ps.orders.update({
        where: {
          offeredById_toCollectioId: {
            offeredById: userId,
            toCollectioId: collectionId,
          },
        },
        data: {
          price: price,
        },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_type) => Boolean)
  @UseMiddleware([isAuth])
  async addOrder(
    @Arg("collectionId", (_type) => Int) collectionId: number,
    @Arg("userEmail", (_type) => String) userEmail: string,
    @Arg("price", (_type) => Int) price: number
  ) {
    try {
      await ps.orders.create({
        data: {
          price: price,
          toCollection: {
            connect: {
              id: collectionId,
            },
          },
          offeredBy: {
            connect: {
              email: userEmail,
            },
          },
        },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }
}
