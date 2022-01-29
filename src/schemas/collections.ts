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
import Orders from "./orders";
import { Category } from "./category";
import { Mods } from "./mods";

@ObjectType()
export default class Collection {
  @Field((_type) => Int)
  id: number;

  @Field((_type) => String)
  name: string;

  @Field((_type) => [String])
  photos: string[];

  @Field((_type) => String, { nullable: true })
  primaryPic?: string;

  @Field((_type) => Int)
  price: number;

  @Field((_type) => Int)
  model: number;

  @Field((_type) => User, { nullable: true })
  owner?: User;

  @Field((_type) => Int, { nullable: true })
  ownerId?: number;

  @Field((_type) => String, { nullable: true })
  brand?: string;

  @Field((_type) => String)
  color: string;

  @Field((_type) => Int, { nullable: true })
  cc?: number;

  @Field((_type) => Int, { nullable: true })
  bhp?: number;

  @Field((_type) => Int, { nullable: true })
  torque?: number;

  @Field((_type) => [Orders])
  orders: Orders[];

  @Field((_type) => String)
  category: string;

  @Field((_type) => Category)
  categories: Category;

  @Field((_type) => Mods)
  mods: Mods[];
}

@Resolver()
export class CollectionResolver {
  @Query((_return) => String)
  @UseMiddleware([isAuth])
  helloFromCollection() {
    return "hi";
  }
}
