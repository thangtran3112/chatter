/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@apollo/client';
import { graphql } from '../gql';
import { updateMessages } from '../cache/messages';
import { updateLatestMessage } from '../cache/latest-message';

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
export const useCreateMessage = () =>
  useMutation(createMessageDocument, {
    update(cache, { data, errors }) {
      const newMessage = data?.createMessage;
      if (newMessage) {
        updateMessages(cache, newMessage);
        updateLatestMessage(cache, newMessage);
      }
    },
  });
