/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { API_URL } from './urls';
import excludedRoutes from './excluded-routes';
import router from '../components/Routes';

//https://www.apollographql.com/docs/react/api/link/introduction/
const logoutLink = onError((error) => {
  if (
    error.graphQLErrors?.length &&
    (error.graphQLErrors[0].extensions.originalError as any).statusCode === 401
  ) {
    if (!excludedRoutes.includes(window.location.pathname)) {
      //navigate to login screen, if the browser is expired on cookie or become unauthenticated
      //navigate outside of component scope, otherwise we could have used useNavigate()
      router.navigate('/login');

      //reset all caches and queries, when we log out client
      client.resetStore();
    }
  }
});

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: logoutLink.concat(httpLink),
});

export default client;
