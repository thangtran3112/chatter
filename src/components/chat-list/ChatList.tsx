import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import Stack from '@mui/material/Stack';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { Divider } from '@mui/material';
import { useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';

export default function ChatList() {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data } = useGetChats();

  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        handleClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader handleAddChat={() => setChatListAddVisible(true)} />
        <Divider />
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            maxHeight: '80vh', // % of view height screen
            overflow: 'auto', //scrollable through the overflow list
          }}
        >
          {data?.chats.map((chat) => (
            <ChatListItem chat={chat} key={chat._id} />
          ))}
        </List>
      </Stack>
    </>
  );
}
