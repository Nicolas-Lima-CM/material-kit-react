import React, { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth';
import Loading from '../components/others/Loading';

interface UserPrivateProps {
  children: ReactNode;
}

function UserPrivate({ children }: UserPrivateProps) {
  const navigate = useNavigate();
  const authProvider = useContext(AuthContext);

  if (!authProvider) {
    throw new Error('useContext must be used within a AuthProvider');
  }

  const { userIsLoggedIn, isVerifyingUserLogin, isGettingFingerprint } = authProvider;

  useEffect(() => {
    if (!userIsLoggedIn && !isVerifyingUserLogin && !isGettingFingerprint) {
      navigate('/login');
    }
  }, [userIsLoggedIn, isVerifyingUserLogin, navigate]);

  if (isVerifyingUserLogin) {
    return <Loading />;
  }

  if (userIsLoggedIn && !isVerifyingUserLogin) {
    return children;
  }

  return null;
}

export default UserPrivate;
