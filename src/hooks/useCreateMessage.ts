/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@apollo/client';
import { graphql } from '../gql';
import { getMessagesDocument } from './useGetMessages';

const createMessageDocument = graphql(`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

/**
 * Update cache on the messages array, belong to the corresponding chatId
 * @param chatId
 * @returns
 */
export const useCreateMessage = (chatId: string) =>
  useMutation(createMessageDocument, {
    update(cache, { data, errors }) {
      const messagesQueryOptions = {
        query: getMessagesDocument,
        variables: {
          chatId,
        },
      };

      const messages = cache.readQuery({
        ...messagesQueryOptions,
      });

      if (!messages || !data?.createMessage) {
        return;
      }

      cache.writeQuery({
        ...messagesQueryOptions,
        data: {
          messages: messages.messages.concat(data?.createMessage),
        },
      });
    },
  });
