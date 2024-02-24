import List from '@mui/material/List';
import ChatListItem from './chat-list-item/ChatListItem';
import Stack from '@mui/material/Stack';
import ChatListHeader from './chat-list-header/ChatListHeader';
import { Divider } from '@mui/material';

export default function ChatList() {
  return (
    <Stack>
      <ChatListHeader />
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
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
      </List>
    </Stack>
  );
}
