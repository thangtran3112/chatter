import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

//This Class is the Model for both Mongoose @Schema, and GraplQL @ObjectType
@Schema({ versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  username: string;

  @Prop()
  password: string; //we should not expose password with @Field to be queriable by external users
}

export const UserSchema = SchemaFactory.createForClass(User);
