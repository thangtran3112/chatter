import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Types } from 'mongoose';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';

@Injectable()
export class MessagesService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    //find the Chat with chatId, and attach the message to the Chat Document
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.userChatFilter(userId),
      }, //this filtering Query will help find the right Chat, for updating the new message
      {
        $push: {
          messages: message,
        },
      }, //after finding the Chat objects, we are updating by pushing new message into messages array
    );

    return message;
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, //if the message is created by the owner of the Chat (matching by userId)
        {
          userIds: {
            $in: [userId], //if the userIds array of the Chat, contains the current message's userId
          },
        },
      ],
    };
  }

  async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    const myChat = await this.chatsRepository.findOne({
      _id: chatId,
      ...this.userChatFilter(userId),
    });

    return myChat.messages || [];
  }
}
