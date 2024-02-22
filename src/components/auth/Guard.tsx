import React from 'react';
import { useGetMe } from '../../hooks/useGetMe';
import excludedRoutes from '../../constants/excluded-routes';

interface GuardProps {
  children: React.JSX.Element;
}

/** Because Guard is a parent of <Router>, we can not use useRouter() to
 * inspect the current route. Instead we use other Javascript feature to check */
const Guard = ({ children }: GuardProps) => {
  const { data: user } = useGetMe();
  console.log(user);

  //if the routes are login or signup, we are not protecting them
  //otherwise, user will need to be authenticated
  return (
    <>
      {excludedRoutes.includes(window.location.pathname)
        ? children
        : user && children}
    </>
  );
};

export default Guard;
