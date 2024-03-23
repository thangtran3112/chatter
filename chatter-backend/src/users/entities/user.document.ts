import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

//This Class is the Model for both Mongoose @Schema, and GraplQL @ObjectType
@Schema({ versionKey: false })
export class UserDocument extends AbstractEntity {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string; //we should not expose password with @Field to be queriable by external users
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
