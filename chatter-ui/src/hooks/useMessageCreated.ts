import { useSubscription } from '@apollo/client';
import { SubscriptionMessageCreatedArgs } from '../gql/graphql';
import { graphql } from '../gql';
import { updateMessages } from '../cache/messages';

/**
 * Subscription GraphQL call
 */
const messageCreatedDocument = graphql(`
  subscription messageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

export const useMessageCreated = (
  variables: SubscriptionMessageCreatedArgs,
) => {
  return useSubscription(messageCreatedDocument, {
    variables,
    onData: ({ client, data }) => {
      if (data.data) {
        const newMessage = data.data.messageCreated;

        //new data on subscription
        updateMessages(client.cache, newMessage);
      }
    },
  });
};
