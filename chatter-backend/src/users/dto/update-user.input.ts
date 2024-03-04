import { CreateUserInput } from './create-user.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  // we instead only want this user to be able to change its own account
  // therefore, we will extract the _id directly from user context
  // @Field()
  // _id: string;
}
