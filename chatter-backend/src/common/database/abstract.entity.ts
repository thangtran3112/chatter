import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
@ObjectType({ isAbstract: true }) //type will not be registered in the schema, but can still be extended
export class AbstractEntity {
  //https://graphql.org/graphql-js/type/#graphqlid
  //ID type is not a Typescript primitive type, so we have to pass a type function into @Field
  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => ID)
  _id: Types.ObjectId;
}
