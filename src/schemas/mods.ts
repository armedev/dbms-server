import { isAuth } from "../middleware/isAuth";
import {
  Field,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import Collection from "./collections";
import ps from "../prisma-client/index";

@ObjectType()
export default class Mods {
  @Field((_type) => String)
  name: string;

  @Field((_type) => [Collection])
  collections: Collection[];
}

@Resolver(Mods)
export class ModsResolver {
  @Query((_returns) => [Mods], { nullable: true })
  @UseMiddleware([isAuth])
  async allMods() {
    return await ps.mods.findMany();
  }
}
