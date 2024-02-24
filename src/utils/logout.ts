import router from '../components/Routes';
import client from '../constants/apollo-client';
import { authenticatedVar } from '../constants/authenticated';

export const onLogout = () => {
  authenticatedVar(false);

  //somehow, without refreshing login page, we are not clear of resetStore(), causing Unauthorized
  window.location.href = '/login';

  //we still want the router to keep track of its path, because, the App is subscribing to router path
  router.navigate('/login');
  client.resetStore();
};
