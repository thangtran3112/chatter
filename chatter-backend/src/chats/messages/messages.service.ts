import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Types } from 'mongoose';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED_TOPIC } from './constants/pubsub';
import { MessageCreatedArgs } from './dto/message-created.args';
import { ChatsService } from '../chats.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatsService: ChatsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      chatId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    //find the Chat with chatId, and attach the message to the Chat Document
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.chatsService.userChatFilter(userId),
      }, //this filtering Query will help find the right Chat, for updating the new message
      {
        $push: {
          messages: message,
        },
      }, //after finding the Chat objects, we are updating by pushing new message into messages array
    );

    //after creating the message in database, we publish the message to pubSub
    const payload = {
      messageCreated: message,
    };
    await this.pubSub.publish(MESSAGE_CREATED_TOPIC, payload);

    return message;
  }

  async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    const myChat = await this.chatsRepository.findOne({
      _id: chatId,
      ...this.chatsService.userChatFilter(userId),
    });

    return myChat.messages || [];
  }

  async messageCreated({ chatId }: MessageCreatedArgs, userId: string) {
    // this command will throw a (404) NotFoundException in findOne() method, if the Chat
    // room with chatId is not belong to the userId from the context
    await this.chatsRepository.findOne({
      _id: chatId,
      ...this.chatsService.userChatFilter(userId),
    });
    //topic name for this specific message type
    //which message go to which subscription by the trigger name
    return this.pubSub.asyncIterator(MESSAGE_CREATED_TOPIC);
  }
}
