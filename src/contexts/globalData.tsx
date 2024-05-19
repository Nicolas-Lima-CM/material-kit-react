import React, { ReactNode, useState, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GlobalDataProviderProps {
  children: ReactNode;
}

interface UserLoginData {
  username: string;
  userPassword: string;
}

type GlobalDataContextType = {
  userLoginTime: number;
  setUserLoginTime: React.Dispatch<React.SetStateAction<number>>;
  tokenHasExpired: boolean;
  setTokenHasExpired: React.Dispatch<React.SetStateAction<boolean>>;
  activeLinkUrl: string;
  lastVisitedPages: string[];
  setActiveLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  setUserLoginData: React.Dispatch<React.SetStateAction<UserLoginData | null>>;
  userLoginData: UserLoginData | null;
  pageLoading: boolean;
  setPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(
  undefined
);

function GlobalDataProvider({ children }: GlobalDataProviderProps) {
  const location = useLocation();

  const [activeLinkUrl, setActiveLinkUrl] = useState("/");
  const [lastVisitedPages, setLastVisitedPages] = useState<string[]>([]);

  // Page Loading
  const [pageLoading, setPageLoading] = useState(true);

  // Token Has Expired
  const [tokenHasExpired, setTokenHasExpired] = useState<boolean>(false);

  // User Remaining Time
  const [userLoginTime, setUserLoginTime] = useState<number>(0);

  // This state will be used to store user information when they register,
  // allowing the 'auth' context to request the PHP to check if the login is correct
  // and obtain the authentication token.
  const [userLoginData, setUserLoginData] = useState<UserLoginData | null>(
    null
  );

  const contextValue = {
    userLoginTime,
    setUserLoginTime,
    tokenHasExpired,
    setTokenHasExpired,
    activeLinkUrl,
    lastVisitedPages,
    setActiveLinkUrl,
    setUserLoginData,
    userLoginData,
    pageLoading,
    setPageLoading,
  };

  useEffect(() => {
    const { pathname, key } = location;

    setActiveLinkUrl(pathname);

    // Checks if the current pathname is neither "/paginaNaoEncontrada", "/acessoNegado", and if the key is not "default". The "default" key is assigned to URLs that are not valid.
    if (
      pathname !== "/paginaNaoEncontrada" &&
      pathname !== "/acessoNegado" &&
      key !== "default"
    ) {
      // Store the current pathname as the last visited page.
      // If there was a previous last visited page, store it as the penultimate visited page.
      setLastVisitedPages((prevState: string[]) => [
        pathname,
        prevState[0] ?? "",
      ]);
    }

    // Prevents any offcanvas from remaining open, allowing the page to scroll normally.
    document.body.style.overflow = "visible";
    document.body.style.paddingRight = "0px";
  }, [location.pathname]);

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export default GlobalDataProvider;
export { GlobalDataContext };
