import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { dismissSessionExpirationWarnings } from '../../utils/toastUtils';
import useAuthContext from '../../hooks/useAuthContext';

function Logout() {
  const { authContext } = useAuthContext();

  const { setUserAuthToken } = authContext;

  const { accountType } = useParams();

  useEffect(() => {
    if (accountType === 'usuario') {
      localStorage.removeItem('userAuthToken');
      dismissSessionExpirationWarnings();
      setUserAuthToken(null);
    }
  }, [accountType]);

  if (accountType === 'usuario') {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/" />;
  }
}

export default Logout;
