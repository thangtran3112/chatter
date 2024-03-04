import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import Stack from '@mui/material/Stack';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import ChatListAdd from './chat-list-add/ChatListAdd';
import { useGetChats } from '../../hooks/useGetChats';
import { usePath } from '../../hooks/usePath';

export default function ChatList() {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data } = useGetChats();
  const [selectedChatId, setSelectedChatId] = useState('');
  //we could use useLocation, but we are outside of <Router>
  const { path } = usePath();

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
        <List
          sx={{
            width: '100%',
            // maxWidth: 360,
            bgcolor: 'background.paper',
            maxHeight: '80vh', // % of view height screen
            overflow: 'auto', //scrollable through the overflow list
          }}
        >
          {data?.chats
            .map((chat) => (
              <ChatListItem
                selected={chat._id === selectedChatId}
                chat={chat}
                key={chat._id}
              />
            ))
            .reverse()}
          {/* reverse to make sure newest Chat show up on top */}
        </List>
      </Stack>
    </>
  );
}
