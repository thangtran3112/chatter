import { gql, useQuery } from '@apollo/client';
import { User } from '../models/User';

const GET_ME = gql`
  query Me {
    me {
      _id
      email
    }
  }
`;

export const useGetMe = () => {
  //{me : User} is considered as a Object Type here
  return useQuery<{ me: User }>(GET_ME);
};
