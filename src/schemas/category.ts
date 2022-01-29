import { Field, ObjectType } from "type-graphql";
import Collection from "./collections";

@ObjectType()
export class Category {
  @Field((_type) => String)
  name: string;

  @Field((_type) => [Collection])
  collections: Collection[];
}
