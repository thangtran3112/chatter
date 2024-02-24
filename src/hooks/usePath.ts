import { useEffect, useState } from 'react';
import router from '../components/Routes';

/**
 * Because the <RouterProvider> is child of <App>, we cannot directly use Router hooks
 * We have to extract a global path state, and let router changes them
 *  */
export const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    router.subscribe((state) => {
      if (state.location.pathname !== window.location.pathname) {
        //we may manually use 'window.location.href' to refresh path at useLogout()
        //we also want to make sure to use router.navigate('/login') to resubscribe the path
        throw new Error('Must use router.navigate() everywhere in the App');
      }
      setPath(state.location.pathname);
    });
  }, []);

  return { path };
};
