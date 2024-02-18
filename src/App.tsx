import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

/**Container allow auto element spacing and justify-center */
const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <h1>Dark Mode</h1>
      </Container>
    </ThemeProvider>
  );
};

export default App;
