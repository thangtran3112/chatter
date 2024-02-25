import { useQuery } from '@apollo/client';
import { graphql } from '../gql';

//ChatFragment is added to graphql types from /fragments
export const getChatsDocument = graphql(`
  query Chats {
    chats {
      ...ChatFragment
    }
  }
`);

export const useGetChats = () => {
  return useQuery(getChatsDocument);
};
