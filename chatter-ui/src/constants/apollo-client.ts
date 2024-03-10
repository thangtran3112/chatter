import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { API_URL, WS_URL } from './urls';
import excludedRoutes from './excluded-routes';
import { onLogout } from '../utils/logout';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const logoutLink = onError((error) => {
  if (
    error.graphQLErrors?.length &&
    (error.graphQLErrors[0].extensions?.originalError as any)?.statusCode ===
      401
  ) {
    if (!excludedRoutes.includes(window.location.pathname)) {
      onLogout();
    }
  }
});

const httpLink = new HttpLink({ uri: `${API_URL}/graphql` });
const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${WS_URL}/graphql`,
  }),
);

/**
 * Since we have both httpLink and wsLink, we will want to differentiate when
 * to use httpLink and when to use wsLink
 */
const splitLink = split(
  ({ query }) => {
    //extract the kind and operation of the query
    const definition = getMainDefinition(query);
    const toUseWsLink =
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription';
    return toUseWsLink;
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chats: {
            //Ignore args such as { skip, limit }
            //Do not cache separate caches based on fields and args
            keyArgs: false,
            //merge incoming data to existing cache
            //existing: array of existing chats, incoming: array of incoming ($limit) chats from query with (skip, limit)
            merge: mergeFn,
          },
          messages: {
            //Caches are separated and isolated by chatId
            //When new messages coming from new pagination getMessages(chatId, skip, limit),
            //We will do the merging based on chatId
            keyArgs: ['chatId'],
            merge: mergeFn,
          },
        },
      },
    },
  }),
  link: logoutLink.concat(splitLink),
});

function mergeFn(existing: any, incoming: any, { args }: any) {
  //make a copy of our existing cache, since Apollo cache is immutable
  const merged = existing ? existing.slice(0) : [];
  //loop through the incoming chats, and merge the new chat to merged array
  for (let i = 0; i < incoming.length; ++i) {
    merged[args.skip + i] = incoming[i];
  }
  return merged;
}

export default client;
