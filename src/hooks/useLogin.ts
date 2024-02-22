import { useState } from 'react';
import { API_URL } from '../constants/urls';
import client from '../constants/apollo-client';

interface LoginRequest {
  email: string;
  password: string;
}

/**Custom hook to return login() callback and error state */
const useLogin = () => {
  const [error, setError] = useState<string>();
  const login = async (request: LoginRequest) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    //non-2xx status
    if (!res.ok) {
      if (res.status === 401) {
        setError('Credentials are not valid.');
      } else {
        setError('Unknown error occured.');
      }
      return;
    }
    setError('');

    //clear all caches and refetch all queries. Apollo Client auto cache request and response
    await client.refetchQueries({ include: 'active' });
  };

  return { login, error };
};

export { useLogin };
