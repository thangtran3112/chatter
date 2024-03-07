import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';

//This will be GraphQL type only, since we are not having @Schema()
@ObjectType()
export class Chat extends AbstractEntity {
  @Field()
  name: string;

  @Field(() => [Message], { nullable: true })
  latestMessage?: Message; //could be empty for a new Chat
}
