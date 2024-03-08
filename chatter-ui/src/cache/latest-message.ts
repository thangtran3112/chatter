import { ApolloCache, ApolloClient } from '@apollo/client';
import { Message } from '../gql/graphql';
import { getChatsDocument } from '../hooks/useGetChats';

//Apollo Client does not support direct mutation of cache query object
export const updateLatestMessage = (
  cache: ApolloCache<any>,
  incomingMessage: Message,
) => {
  const chats = [
    ...(cache.readQuery({ query: getChatsDocument })?.chats || []),
  ];
  const cachedChatIndex = chats.findIndex(
    (chat) => chat._id === incomingMessage.chatId,
  );
  if (cachedChatIndex === -1) {
    return;
  }
  const cachedChat = chats[cachedChatIndex];
  const cachedChatCopy = { ...cachedChat };
  cachedChatCopy.latestMessage = incomingMessage;
  chats[cachedChatIndex] = cachedChatCopy;
  cache.writeQuery({
    query: getChatsDocument,
    data: {
      chats,
    },
  });
};
