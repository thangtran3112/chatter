import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const createMessageDocument = graphql(`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

export const useCreateMessage = () => useMutation(createMessageDocument);
