import { graphql } from '../gql';

export const ChatFrag = graphql(`
  fragment ChatFragment on Chat {
    _id
    userId
    isPrivate
    userIds
    name
  }
`);
