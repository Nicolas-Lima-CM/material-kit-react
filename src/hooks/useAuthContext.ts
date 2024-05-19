import { useContext, useMemo } from "react";
import { AuthContext } from "../contexts/auth";

const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useContext must be used within a AuthProvider");
  }

  const notFormattedUserAuthToken = authContext.userAuthToken;

  // Formatted User Auth Token
  const userAuthToken = useMemo(() => {
    return notFormattedUserAuthToken ?? "";
  }, [notFormattedUserAuthToken]);

  return { authContext, userAuthToken };
};

export default useAuthContext;
