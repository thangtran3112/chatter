import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const createChatDocument = graphql(`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      _id
      userId
      isPrivate
      userIds
      name
    }
  }
`);

export const useCreateChat = () => {
  return useMutation(createChatDocument);
};
