import { useCallback, useState } from 'react';
import { API_URL } from '../constants/urls';
import { snackVar } from '../constants/snack';
import { UNKNOWN_ERROR_SNACK_MESSAGE } from '../constants/errors';

export const useCountMessages = (chatId: string) => {
  const [messagesCount, setMessagesCount] = useState<number | undefined>();

  //the fetch function is not change, we do not want wasted re-rendering
  const countMessagesQuery = useCallback(async () => {
    const res = await fetch(`${API_URL}/messages/count?chatId=${chatId}`);
    if (!res.ok) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
      return;
    }
    const { messages: count } = await res.json();
    setMessagesCount(count);
  }, [chatId]); //when chatId changes, we will reconstruct countMessagesQuery function

  return { messagesCount, countMessagesQuery };
};
