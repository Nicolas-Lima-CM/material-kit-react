import React, { ReactNode, useState, createContext, useEffect } from 'react';
import { createApiUrl } from '../services/apiUrl';
import useGlobalDataContext from '../hooks/useGlobalDataContext';

import Loading from '../components/others/Loading';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { dismissSessionExpirationWarnings } from '../utils/toastUtils';

import useFingerprint from '../hooks/useFingerprint';
import { SetState } from '../types/types';

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextType = {
  checkResourcesPermission: ({
    resourceNames,
    setIsCheckingResources,
  }: {
    resourceNames: string[];
    setIsCheckingResources: SetState<boolean>;
  }) => Promise<Record<string, boolean>>;
  userIsLoggedIn: boolean;
  setUserIsLoggedIn: SetState<boolean>;
  setUserAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  getUserAuthToken: (username: string, userPassword: string) => Promise<boolean>;
  userAuthToken: string | null;
  logoutUserWithExpiredLoginMessage: () => void;
  isVerifyingUserLogin: boolean;
  setIsGettingFingerprint: SetState<boolean>;
  isGettingFingerprint: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUserLoginTime, tokenHasExpired, setTokenHasExpired, pageLoading, setPageLoading } =
    useGlobalDataContext();

  const [loadingCount, setLoadingCount] = useState(0);

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isVerifyingUserLogin, setIsVerifyingUserLogin] = useState(false);
  const [userAuthToken, setUserAuthToken] = useState<string | null>(null);

  // Is Getting fingerprint
  const [isGettingFingerprint, setIsGettingFingerprint] = useState<boolean>(true);

  // Finger Print
  const fingerprint = useFingerprint() || '';

  const getUserAuthToken = async (username: string, userPassword: string): Promise<boolean> => {
    setIsVerifyingUserLogin(true);

    const url = createApiUrl('userLogin.php');
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password: userPassword,
        fingerprint,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const { success, token } = result;
        if (success && token) {
          setUserAuthToken(token);
          localStorage.setItem('userAuthToken', JSON.stringify(token));
          return true;
        } else {
          return false;
        }
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setIsVerifyingUserLogin(false);
      });
  };

  const verifyUserLogin = ({ userAuthToken }: { userAuthToken: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsVerifyingUserLogin(true);

      const url = createApiUrl('verifyUserLogin.php');
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token: userAuthToken,
          fingerprint,
        }).toString(),
      })
        .then((response) => response.json())
        .then((result) => {
          const { success, user_id, message, remainingTime } = result;

          setUserLoginTime(remainingTime ? remainingTime : 0);

          const resultMessage = message ? message.toLowerCase() : '';
          if (resultMessage.includes('token has expired')) {
            logoutUserWithExpiredLoginMessage();
          } else if (resultMessage.includes('user is not active')) {
            toast.error('Este usuário não está ativo!');
            localStorage.removeItem('userAuthToken');
          }

          const isLoggedIn = !!(success && user_id);

          if (isLoggedIn) {
            setTokenHasExpired(false);
          }

          setUserIsLoggedIn(isLoggedIn);
          setIsVerifyingUserLogin(false);

          resolve(isLoggedIn);
        })
        .catch(() => {
          toast.error('Erro ao buscar os dados!');
          setIsVerifyingUserLogin(false);
          resolve(false);
        });
    });
  };

  const checkResourcesPermission = async ({
    resourceNames,
    setIsCheckingResources,
  }: {
    resourceNames: string[];
    setIsCheckingResources: SetState<boolean>;
  }): Promise<Record<string, boolean>> => {
    setIsCheckingResources(true); // Start checking resources

    const permissions: Record<string, boolean> = {};

    for (const resourceName of resourceNames) {
      try {
        const url = createApiUrl('hasResourcePermission.php');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: userAuthToken ?? '',
            resourceName,
          }).toString(),
        });

        const result = await response.json();
        permissions[resourceName] = !!result.success;
      } catch (error) {
        permissions[resourceName] = false;
      }
    }

    setIsCheckingResources(false); // Stop checking resources
    return permissions;
  };

  const logoutUserWithExpiredLoginMessage = () => {
    toast.warn('Tempo de sessão expirado!', {
      toastId: 'login-expired-toast',
    });
    localStorage.removeItem('userAuthToken');
    setUserAuthToken(null);
    setUserIsLoggedIn(false);
  };

  useEffect(() => {
    const userAuthTokenLS = localStorage.getItem('userAuthToken');

    if (userAuthTokenLS && fingerprint) {
      const userAuthTokenParsed = JSON.parse(userAuthTokenLS);

      setUserAuthToken(userAuthTokenParsed);

      // Increment loading count before starting verification
      setLoadingCount((prevCount) => prevCount + 1);

      verifyUserLogin({ userAuthToken: userAuthTokenParsed }).finally(() => {
        // Decrement loading count after verification
        setLoadingCount((prevCount) => prevCount - 1);

        // If you're on the 'login' page
        if (location.pathname === '/login') {
          navigate('/usuario');
        }
      });
    } else {
      setUserIsLoggedIn(false);
      setUserLoginTime(0);
    }

    if (!userAuthTokenLS && !fingerprint) {
      setIsVerifyingUserLogin(false);
    }
  }, [userAuthToken, fingerprint]);

  useEffect(() => {
    if (tokenHasExpired && !pageLoading && (userAuthToken || userIsLoggedIn)) {
      logoutUserWithExpiredLoginMessage();

      dismissSessionExpirationWarnings();
    }
  }, [tokenHasExpired]);

  useEffect(() => {
    // Set pageLoading to false only when loadingCount is 0
    if (loadingCount === 0) {
      setPageLoading(false);
    }
  }, [loadingCount]);

  // Is Getting Fingerprint useEffect
  useEffect(() => {
    if (fingerprint) {
      setIsGettingFingerprint(false);
    }
  }, [fingerprint]);

  const contextValue = {
    checkResourcesPermission,
    userIsLoggedIn,
    setUserIsLoggedIn,
    setUserAuthToken,
    getUserAuthToken,
    userAuthToken,
    isVerifyingUserLogin,
    logoutUserWithExpiredLoginMessage,
    setIsGettingFingerprint,
    isGettingFingerprint,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {pageLoading || isGettingFingerprint ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };
