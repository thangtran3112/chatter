import { useLocation, useParams } from 'react-router-dom';
import { useGetChat } from '../../hooks/useGetChat';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useCreateMessage } from '../../hooks/useCreateMessage';
import { useEffect, useRef, useState } from 'react';
import { useGetMessages } from '../../hooks/useGetMessages';
import { PAGE_SIZE } from '../../constants/page-size';
import { useCountMessages } from '../../hooks/useCountMessages';
import InfiniteScroll from 'react-infinite-scroller';

const chat = () => {
  const params = useParams();
  const [message, setMessage] = useState('');
  const chatId = params._id!;
  const { data } = useGetChat({ _id: chatId });
  const [createMessage] = useCreateMessage();
  const { data: allMessages, fetchMore } = useGetMessages({
    chatId,
    skip: 0,
    limit: PAGE_SIZE,
  });
  const divRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { messagesCount, countMessagesQuery } = useCountMessages(chatId);

  //everytime the chatId changes, countMessagesQuery function will change,
  //as of useCallback() inside useCountMessages() hook.
  useEffect(() => {
    countMessagesQuery();
  }, [countMessagesQuery]);

  // console.log(latestMessage);

  const scrollToBottom = () => divRef.current?.scrollIntoView();

  /**
   * Since we are updating the cache directly on src/cache/message.ts,
   * This useEffect will become redundant
   * */
  /*useEffect(() => {
    if (existingMessages) {
      setMessages(existingMessages.messages);
    }
  }, [existingMessages]);*/

  //whenever we Load a Chat, the Url will change with the new ChatId,
  //or when the messages list are changed (someone send us a message)
  //we want to scroll down to the bottom, to see the latest message
  //we do not want this effect, when user is scrolling up
  useEffect(() => {
    if (allMessages?.messages && allMessages.messages.length <= PAGE_SIZE) {
      //When user first clicks on a Chat
      setMessage('');
      scrollToBottom();
    }
  }, [location, allMessages]);

  const handleSendMessage = async () => {
    await createMessage({
      variables: {
        createMessageInput: { content: message, chatId },
      },
    });

    //after sending the message, we want to reset the Chat text field
    setMessage('');
    //and scroll down to bottom
    scrollToBottom();
  };

  return (
    <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
      <h1>{data?.chat.name}</h1>
      {/* The Chat will have 70/100 view height, and scrollable if overflow */}
      <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <InfiniteScroll
          pageStart={0}
          isReverse={true}
          loadMore={() =>
            fetchMore({ variables: { skip: allMessages?.messages.length } })
          }
          hasMore={
            allMessages && messagesCount
              ? allMessages.messages.length < messagesCount
              : false
          }
          useWindow={false}
        >
          {allMessages &&
            [...allMessages.messages]
              .sort(
                (messageA, messageB) =>
                  new Date(messageA.createdAt).getTime() -
                  new Date(messageB.createdAt).getTime(),
              ) //sorting all messages based on timestamp
              .map((curMessage) => (
                <Grid
                  key={curMessage._id}
                  container
                  alignItems="center"
                  marginBottom="1rem"
                >
                  {/* Using 3 collumns for small screen, 1 collumn for medium screen */}
                  <Grid item xs={2} lg={1}>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={curMessage.user.imageUrl}
                        sx={{ width: 52, height: 52 }}
                      />
                      <Typography variant="caption">
                        {curMessage.user.username}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={10} lg={11}>
                    <Stack>
                      {/* Using <Paper> to hold Chat content for some elevation */}
                      <Paper sx={{ width: 'fit-content' }}>
                        <Typography sx={{ padding: '0.9rem' }}>
                          {curMessage.content}
                        </Typography>
                      </Paper>
                      {/* Timestamp */}
                      <Typography
                        variant="caption"
                        sx={{ marginLeft: '0.25rem' }}
                      >
                        {new Date(curMessage.createdAt).toLocaleTimeString()} -{' '}
                        {new Date(curMessage.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ))}
          <div ref={divRef}></div>
        </InfiniteScroll>
      </Box>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          justifySelf: 'flex-end', //message bar to be sticked to the bottom of the container
          alignItems: 'center',
          width: '100%',
          margin: '1rem 0',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: '100%' }}
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              await handleSendMessage();
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: '10px' }}
          onClick={handleSendMessage}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default chat;
