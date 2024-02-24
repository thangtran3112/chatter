import {
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import router from './components/Routes';
import { ApolloProvider } from '@apollo/client';
import client from './constants/apollo-client';
import Guard from './components/auth/Guard';
import Header from './components/header/Header';
import Snackbar from './components/snackbar/Snackbar';
import ChatList from './components/chat-list/ChatList';
import { usePath } from './hooks/usePath';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const { path } = usePath();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Guard>
          {path === '/' ? (
            <Grid container>
              {/* 3 collumns from medium break points */}
              <Grid item md={3}>
                <ChatList />
              </Grid>
              {/* 9 collumns from medium break points */}
              <Grid item md={9}>
                <Routes />
              </Grid>
            </Grid>
          ) : (
            <Routes />
          )}
        </Guard>
        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
};

const Routes = () => {
  return (
    <Container>
      <RouterProvider router={router} />
    </Container>
  );
};

export default App;
