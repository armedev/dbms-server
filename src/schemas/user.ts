import {
  Arg,
  Query,
  Resolver,
  Field,
  ObjectType,
  Mutation,
  Int,
  UseMiddleware,
  Ctx,
  // Ctx,
} from "type-graphql";
import { hash, compare } from "bcrypt";
import ps from "../prisma-client/index";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../middleware/isAuth";
import { isAdmin } from "../middleware/isAdmin";
import { ExpressContext } from "src/interfaces/req-res";
import Orders from "./orders";
import Collection from "./collections";
// import { ExpressContext } from "src/interfaces/req-res";

const salt = 10;

@ObjectType()
class LoginResponse {
  @Field((_type) => String)
  accessToken: string;
}

@ObjectType()
export default class User {
  @Field((_type) => Int)
  id: number;
  @Field((_type) => String)
  email: string;
  @Field((_type) => String, { nullable: true })
  name?: string | null;
  @Field((_type) => Boolean)
  admin: boolean;

  @Field((_type) => [Orders], { nullable: true })
  orders: Orders[];

  @Field((_type) => [Collection], { nullable: true })
  collections: Collection[];
}

@Resolver(User)
export class UserResolver {
  @Query((_returns) => String)
  @UseMiddleware([isAuth])
  hello() {
    return "hi";
  }

  @Query((_returns) => [User], { nullable: true })
  @UseMiddleware([isAuth])
  async allUsers() {
    return await ps.user.findMany({
      include: {
        orders: {
          orderBy: { price: "desc" },
          include: { toCollection: { select: { name: true, id: true } } },
        },
        collections: true,
      },
    });
  }

  @Query((_returns) => User, { nullable: true })
  @UseMiddleware([isAuth])
  async getUser(@Ctx() { payload }: ExpressContext) {
    if (!payload) throw new Error("Not A user");
    return await ps.user.findUnique({ where: { id: payload.UserId } });
  }

  @Mutation((_returns) => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, salt);
    try {
      await ps.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
        },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth, isAdmin])
  async addUser(
    @Arg("email") email: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("password") password: string,
    @Arg("admin") admin: boolean
  ) {
    const hashedPassword = await hash(password, salt);
    try {
      await ps.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
          admin,
        },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth, isAdmin])
  async updateUser(
    @Arg("id", (_type) => Int) id: number,
    @Arg("email") email: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("admin") admin: boolean
  ) {
    try {
      await ps.user.update({
        where: { id },
        data: { email: email, name, admin: admin },
      });
      return true;
    } catch (err) {
      throw new Error(err?.meta?.target || err);
    }
  }

  @Mutation((_returns) => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: ExpressContext
  ): Promise<LoginResponse> {
    const user = await ps.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const passwordValid = await compare(password, user.passwordHash);
    if (!passwordValid) throw new Error("password invalid");
    res.cookie("gasMonkey", createRefreshToken(user), {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      maxAge: 99999999,
    });
    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware([isAuth, isAdmin])
  async removeUser(@Arg("id", (_type) => Int) id: number) {
    try {
      await ps.user.delete({
        where: { id },
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("deletion failed");
    }
  }
}
