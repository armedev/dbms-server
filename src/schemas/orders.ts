// import { Collection } from ".prisma/client";
import { isAuth } from "../middleware/isAuth";
import {
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import User from "./user";
import Collection from "./collections";

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
  @Query((_returns) => String)
  @UseMiddleware([isAuth])
  helloOrders() {
    return "hi";
  }
}
