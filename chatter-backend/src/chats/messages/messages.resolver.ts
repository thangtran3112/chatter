import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED_TOPIC } from './constants/pubsub';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message], { name: 'messages' })
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }

  /**
   *
   * @param variables (variables {chatId} is sent from the UI to subscribe to a Chat room)
   * @param payload is the incomming message that needs to be filter to send to subscribers
   * @param context which we extract the user from JWT token. See app.module.ts => GraphQLModule
   */
  @Subscription(() => Message, {
    //filter for corresponding messages
    filter: (payload, variables, context) => {
      //subscriber userId, when the websocket connection is initialized
      //Reference: onConnect() in GraphQLModule from app.module.ts
      const subscriberUserId = context.req.user._id;
      const senderUserId = payload.messageCreated.userId;
      const isSubscriberNotSender = subscriberUserId !== senderUserId;

      //incoming message (payload.message) to be compared with the subscription chatId
      //this API will be called by UI client with { chatId } to subscribe to the topic
      return (
        payload.messageCreated.chatId === variables.chatId &&
        isSubscriberNotSender
      );
    },
  })
  messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
    //passing from getCurrentUserByContext() in current-user.decorator.ts,
    //and modified by onConnect() in GraphQLModule of app.module.ts
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.messageCreated(messageCreatedArgs, user._id);
  }
}
