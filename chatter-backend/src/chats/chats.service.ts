import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      userIds: createChatInput.userIds || [],
      messages: [],
    });
  }

  async findAll(userId: string) {
    return this.chatsRepository.find({ ...this.userChatFilter(userId) });
  }

  async findOne(_id: string) {
    return this.chatsRepository.findOne({ _id });
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
  userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, //if the message is created by the owner of the Chat (matching by userId)
        {
          userIds: {
            $in: [userId], //if the userIds array of the Chat, contains the current message's userId
          },
        },
        {
          isPrivate: false, //if the Chat room is Public, any user can see it
        },
      ],
    };
  }
}
