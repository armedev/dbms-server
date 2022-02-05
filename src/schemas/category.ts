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
export default class Category {
  @Field((_type) => String)
  name: string;

  @Field((_type) => [Collection])
  collections: Collection[];
}

@Resolver(Category)
export class CategoryResolver {
  @Query((_returns) => [Category], { nullable: true })
  @UseMiddleware([isAuth])
  async allCategories() {
    return await ps.category.findMany();
  }
}
