import { useSubscription } from '@apollo/client';
import { SubscriptionMessageCreatedArgs } from '../gql/graphql';
import { graphql } from '../gql';

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
  return useSubscription(messageCreatedDocument, { variables });
};
