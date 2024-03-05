import { ApolloCache } from '@apollo/client';
import { Message } from '../gql/graphql';
import { getMessagesDocument } from '../hooks/useGetMessages';

export const updateMessages = (
  cache: ApolloCache<any>,
  newMessage: Message,
) => {
  const messagesQueryOptions = {
    query: getMessagesDocument,
    variables: {
      chatId: newMessage.chatId,
    },
  };

  const existingMessages = cache.readQuery({
    ...messagesQueryOptions,
  });

  // if (!messages || !data?.createMessage) {
  //   return;
  // }

  cache.writeQuery({
    ...messagesQueryOptions,
    data: {
      messages: (existingMessages?.messages || []).concat(newMessage),
    },
  });
};
