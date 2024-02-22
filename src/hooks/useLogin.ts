import { useState } from 'react';
import { API_URL } from '../constants/urls';
import client from '../constants/apollo-client';

interface LoginRequest {
  email: string;
  password: string;
}

/**Custom hook to return login() callback and error state */
const useLogin = () => {
  const [error, setError] = useState<boolean>(false);
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
      setError(true);
      return;
    }
    setError(false);

    //clear all caches and queries. Apollo Client auto cache request and response
    await client.refetchQueries({ include: 'active' });
  };

  return { login, error };
};

export { useLogin };
