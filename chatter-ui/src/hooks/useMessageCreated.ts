import { useSubscription } from '@apollo/client';
import { SubscriptionMessageCreatedArgs } from '../gql/graphql';
import { graphql } from '../gql';
import { updateMessages } from '../cache/messages';
import { updateLatestMessage } from '../cache/latest-message';

/**
 * Subscription GraphQL call
 */
const messageCreatedDocument = graphql(`
  subscription messageCreated($chatIds: [String!]!) {
    messageCreated(chatIds: $chatIds) {
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
        updateLatestMessage(client.cache, newMessage);
      }
    },
  });
};
