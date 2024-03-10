import { useQuery } from '@apollo/client';
import { graphql } from '../gql';
import { QueryChatsArgs } from '../gql/graphql';

//ChatFragment is added to graphql types from /fragments
export const getChatsDocument = graphql(`
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFragment
    }
  }
`);

export const useGetChats = (variables: QueryChatsArgs) => {
  return useQuery(getChatsDocument, { variables });
};
