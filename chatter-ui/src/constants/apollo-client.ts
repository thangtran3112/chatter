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
  cache: new InMemoryCache(),
  link: logoutLink.concat(splitLink),
});

export default client;
