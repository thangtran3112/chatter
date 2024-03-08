import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { PipelineStage, Types } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    });
  }

  async findMany(prePipelineStages: PipelineStage[] = []) {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      { $set: { latestMessage: { $arrayElemAt: ['$messages', -1] } } }, //-1 means last element
      { $unset: 'messages' }, //get rid of all messages
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);
    chats.forEach((chat) => {
      //new Chat, latestMessage are not available
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      chat.latestMessage.chatId = chat._id;
    });
    return chats;
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { chatId: new Types.ObjectId(_id) } },
    ]);
    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID: ${_id}`);
    }

    return chats[0];
  }

  async update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  /**
   * MongoDB Filter query to check if an userId is:
   * 1. The owner of the chatroom
   * 2. A Partiticipant in userIds array
   * 3. If the chatroom is public, the message is for everyone
   */
  // userChatFilter(userId: string) {
  //   return {
  //     $or: [
  //       { userId }, //if the message is created by the owner of the Chat (matching by userId)
  //       {
  //         userIds: {
  //           $in: [userId], //if the userIds array of the Chat, contains the current message's userId
  //         },
  //       },
  //       {
  //         isPrivate: false, //if the Chat room is Public, any user can see it
  //       },
  //     ],
  //   };
  // }
}
