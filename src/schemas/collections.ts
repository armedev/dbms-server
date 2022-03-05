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
import Orders from "./orders";
import Category from "./category";
import Mods from "./mods";
import ps from "../prisma-client/index";

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

  @Field((_type) => String, { nullable: true })
  bhp?: string;

  @Field((_type) => String, { nullable: true })
  torque?: string;

  @Field((_type) => [Orders])
  orders: Orders[];

  @Field((_type) => String)
  category: string;

  @Field((_type) => Category)
  categories: Category;

  @Field((_type) => [Mods])
  mods: Mods[];
}

@Resolver()
export class CollectionResolver {
  @Query((_return) => [Collection])
  @UseMiddleware([isAuth])
  async allCollections() {
    return await ps.collection.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        mods: true,
        owner: { select: { email: true, id: true, name: true } },
        orders: {
          select: {
            price: true,
            offeredBy: { select: { name: true, email: true } },
          },
        },
      },
    });
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth])
  async deleteCollection(@Arg("id", (_type) => Int) id: number) {
    try {
      await ps.collection.delete({ where: { id } });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("deletion failed");
    }
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth])
  async addCollection(
    @Arg("name", (_type) => String) name: string,
    @Arg("color", (_type) => String) color: string,
    @Arg("model", (_type) => Int) model: number,
    @Arg("price", (_type) => Int) price: number,
    @Arg("bhp", (_type) => String, { nullable: true }) bhp: string,
    @Arg("brand", (_type) => String, { nullable: true }) brand: string,
    @Arg("categories", (_type) => String, { nullable: true })
    categories: string | undefined,
    @Arg("mods", (_type) => [String], { nullable: true }) mods: string[],
    @Arg("cc", (_type) => Int, { nullable: true }) cc: number,
    @Arg("owner", (_type) => String, { nullable: true })
    owner: string | undefined,
    @Arg("torque", (_type) => String, { nullable: true }) torque: string,
    @Arg("primaryPic", (_type) => String) primaryPic: string,
    @Arg("photos", (_type) => [String], { nullable: true }) photos: string[]
  ) {
    try {
      if (!owner) owner = "";
      if (!categories) categories = "";
      await ps.collection.create({
        data: {
          name: name,
          color: color,
          model: model,
          price: price,
          bhp: bhp,
          brand: brand,
          categories: {
            connect: {
              name: categories,
            },
          },
          mods: {
            connect: mods.map((mod) => ({ name: mod })),
          },
          cc: cc,
          owner: {
            connect: {
              email: owner,
            },
          },
          torque: torque,
          primaryPic: primaryPic,
          photos: photos,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth])
  async updateCollection(
    @Arg("id", (_type) => Int) id: number,
    @Arg("name", (_type) => String) name: string,
    @Arg("color", (_type) => String) color: string,
    @Arg("model", (_type) => Int) model: number,
    @Arg("price", (_type) => Int) price: number,
    @Arg("bhp", (_type) => String, { nullable: true }) bhp: string,
    @Arg("brand", (_type) => String, { nullable: true }) brand: string,
    @Arg("categories", (_type) => String, { nullable: true })
    categories: string | undefined,
    @Arg("mods", (_type) => [String], { nullable: true }) mods: string[],
    @Arg("cc", (_type) => Int, { nullable: true }) cc: number,
    @Arg("owner", (_type) => String, { nullable: true })
    owner: string | undefined,
    @Arg("torque", (_type) => String, { nullable: true }) torque: string,
    @Arg("primaryPic", (_type) => String) primaryPic: string,
    @Arg("photos", (_type) => [String], { nullable: true }) photos: string[]
  ) {
    try {
      if (!owner) owner = "";
      if (!categories) categories = "";
      await ps.collection.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          color: color,
          model: model,
          price: price,
          bhp: bhp,
          brand: brand,
          categories: {
            connect: {
              name: categories,
            },
          },
          mods: {
            set: mods.map((mod) => ({ name: mod })),
            // connect: mods.map((mod) => ({ name: mod })),
          },
          cc: cc,
          owner: {
            connect: {
              email: owner,
            },
          },
          torque: torque,
          primaryPic: primaryPic,
          photos: photos,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation(() => [Collection], { nullable: true })
  @UseMiddleware([isAuth])
  async searchCollections(@Arg("key", (_type) => String) key: string) {
    const res = await ps.collection.findMany({
      include: {
        mods: true,
        owner: { select: { email: true, id: true, name: true } },
        orders: {
          select: {
            price: true,
            offeredBy: { select: { name: true, email: true } },
          },
        },
      },
      take: 10,
    });
    key = key.toLowerCase();
    return res.filter((r) => String(r.name).toLowerCase().includes(key));
  }
}
