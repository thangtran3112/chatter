/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@apollo/client';
import { graphql } from '../gql';
import { ChatFragment } from '../fragments/chat.fragment';

const createChatDocument = graphql(`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      ...ChatFragment
    }
  }
`);

/**
 * Although Apollo Client can automatically cache primitive value
 * However getChats would return array, the array cache will not be updated by default
 * We need to manually update the cache, after adding a new Chat
 */
export const useCreateChat = () => {
  return useMutation(createChatDocument, {
    //destructure CreateChatMutation into data
    update(cache, { data, errors }) {
      cache.modify({
        fields: {
          chats(existingChats = []) {
            const newChatRef = cache.writeFragment({
              data: data?.createChat,
              fragment: ChatFragment,
              fragmentName: 'ChatFragment',
            });
            return [...existingChats, newChatRef];
          },
        },
      });
    },
  });
};
