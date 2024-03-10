import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import Stack from '@mui/material/Stack';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';
import { usePath } from '../../hooks/usePath';
import { useMessageCreated } from '../../hooks/useMessageCreated';
import { PAGE_SIZE } from '../../constants/page-size';
import InfiniteScroll from 'react-infinite-scroller';
import { useCountChats } from '../../hooks/useCountChats';

export default function ChatList() {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data, fetchMore } = useGetChats({
    skip: 0,
    limit: PAGE_SIZE,
  });
  const [selectedChatId, setSelectedChatId] = useState('');
  //we could use useLocation, but we are outside of <Router>
  const { path } = usePath();
  const { chatsCount, countChats } = useCountChats();

  //this effect will run once on mounting, and generate chatsCount
  useEffect(() => {
    countChats();
  }, [countChats]);

  useMessageCreated({ chatIds: data?.chats.map((chat) => chat._id) || [] });

  /**
   * Every time the path is changed, we are setting the selectedChatId from path
   * Example of path: /chats/65dd4b43ac8ff3f1ab09f9b4
   */
  useEffect(() => {
    const pathSplit = path.split('chats/');
    if (pathSplit.length === 2) {
      setSelectedChatId(pathSplit[1]);
    }
  }, [path]);

  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        handleClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader handleAddChat={() => setChatListAddVisible(true)} />
        <Divider />
        <Box
          sx={{
            width: '100%',
            // maxWidth: 360,
            bgcolor: 'background.paper',
            maxHeight: '80vh', // % of view height screen
            overflow: 'auto', //scrollable through the overflow list
          }}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={() =>
              fetchMore({
                variables: {
                  skip: data?.chats.length,
                },
              })
            }
            hasMore={
              data?.chats && chatsCount ? data.chats.length < chatsCount : false
            }
            useWindow={false}
          >
            {data?.chats &&
              [...data.chats]
                .sort((a, b) => {
                  if (!a.latestMessage) {
                    return -1;
                  } else {
                    return (
                      new Date(a.latestMessage?.createdAt).getTime() -
                      new Date(b?.latestMessage?.createdAt).getTime()
                    );
                  }
                })
                .map((chat) => (
                  <ChatListItem
                    selected={chat._id === selectedChatId}
                    chat={chat}
                    key={chat._id}
                  />
                ))
                .reverse()}
            {/* reverse to make sure newest Chat show up on top */}
          </InfiniteScroll>
        </Box>
      </Stack>
    </>
  );
}
