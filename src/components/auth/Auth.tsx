import { Button, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetMe } from '../../hooks/useGetMe';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  submitLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  children: React.ReactNode;
  error?: string;
}

const Auth = ({ submitLabel, onSubmit, children, error }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //in useLogin() we are calling client.refetchQueries(), which would force all queries to get refetched
  //which would trigger the change of authenticated user from useGetMe()
  const { data: currentUser } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      //if data presents, we have an authenticated user in this Context. Browser is in Authenticated state
      navigate('/');
    }
  }, [currentUser, navigate]);
  return (
    <Stack
      spacing={3}
      sx={{
        height: '100vh',
        maxWidth: {
          xs: '70%',
          md: '30%',
        },
        margin: '0 auto',
        justifyContent: 'center',
      }}
    >
      <TextField
        type="email"
        label="email"
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={!!error} //directly convert error from string to boolean (when it is empty, null, undefined)
        helperText={error}
      />
      <TextField
        type="password"
        label="password"
        variant="outlined"
        value={password}
        error={!!error} //directly convert error from string to boolean (when it is empty, null, undefined)
        helperText={error}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={() => onSubmit({ email, password })}>
        {submitLabel}
      </Button>
      {children}
    </Stack>
  );
};

export default Auth;
