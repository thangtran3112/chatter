import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Types } from 'mongoose';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED_TOPIC } from './constants/pubsub';
import { MessageDocument } from './entities/message.document';
import { UsersService } from 'src/users/users.service';
import { USERS_TABLE, USER_ID } from 'src/common/constants/database';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const messageDocument: MessageDocument = {
      content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    //find the Chat with chatId, and attach the message to the Chat Document
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        // ...this.chatsService.userChatFilter(userId),
      }, //this filtering Query will help find the right Chat, for updating the new message
      {
        $push: {
          messages: messageDocument,
        },
      }, //after finding the Chat objects, we are updating by pushing new message into messages array
    );
    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.usersService.findOne(userId),
    };
    //after creating the message in database, we publish the message to pubSub
    const payload = {
      messageCreated: message,
    };
    await this.pubSub.publish(MESSAGE_CREATED_TOPIC, payload);

    return message;
  }

  async countMessages(chatId: string) {
    const res = await this.chatsRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' }, // breaking each message to create array of {chatId, single message}
      { $count: 'messages' }, //return example: { "messages" : 4 }
    ]);
    return res[0]; //can also be res.messages
  }

  //After the Mongo aggregation pipeline, we obtains the array of Message with the shape from message.entity
  async getMessages({ chatId, skip, limit }: GetMessagesArgs) {
    const messages = await this.chatsRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } }, //first step: get the Chat
      { $unwind: '$messages' }, //unpack all messages (property of Chat Document), to individual messages
      { $replaceRoot: { newRoot: '$messages' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: USERS_TABLE, // users collection
          localField: USER_ID,
          foreignField: '_id', //field in the 'users' collection, which is correspond to  in previous 'userId'
          as: 'user', //transform to 'user' on this message. Lookup operator set this as array by default
        },
      },
      { $unwind: '$user' }, //unwind the output array from 'lookup' to User object
      { $unset: USER_ID }, //remove userId attribute from 'user' as it is not needed
      { $set: { chatId } }, //attach chatId to this message document, as to make it become message.entity form
    ]);

    for (const message of messages) {
      message.user = this.usersService.toEntity(message.user);
    }

    return messages;
  }

  async messageCreated() {
    return this.pubSub.asyncIterator(MESSAGE_CREATED_TOPIC);
  }
}
