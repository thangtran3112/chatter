/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { PipelineStage, Types } from 'mongoose';
import { USERS_TABLE } from 'src/common/constants/database';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    });
  }

  async findMany(
    prePipelineStages: PipelineStage[] = [],
    paginationArgs?: PaginationArgs,
  ) {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            //only get the latestMessage, if the Chat actually has messages defined
            $cond: [
              '$messages',
              { $arrayElemAt: ['$messages', -1] }, //-1 means last element
              {
                //if the Chat has no messages, set the createdAt attribute of lastest Message to now
                createdAt: new Date(),
              },
            ],
          },
        },
      },
      { $sort: { 'latestMessage.createdAt': -1 } }, //sort all chats based on its latest message, -1 for descending
      { $skip: paginationArgs?.skip }, //skip the N number of documents that we specify
      { $limit: paginationArgs?.limit }, //the pageSize or the number of documents we will retrive after skipping N documents
      { $unset: 'messages' }, //get rid of all messages
      {
        $lookup: {
          from: USERS_TABLE,
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
      chat.latestMessage.user = this.usersService.toEntity(
        chat.latestMessage.user[0],
      );
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

  async countChats() {
    //this used to be this.chatsRepository.model.count()
    return this.chatsRepository.model.countDocuments({});
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
