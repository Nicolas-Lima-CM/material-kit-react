import React, { useState, useContext, ReactNode, useEffect } from "react";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import { createApiUrl } from "../../../services/apiUrl";

interface CheckPermissionProps {
  children: ReactNode;
  portID?: string;
}

function CheckPermission({ children, portID }: CheckPermissionProps) {
  if (!portID) {
    throw new Error("portID must be provided");
  }

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useContext must be used within a AuthProvider");
  }

  const navigate = useNavigate();

  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  const { userAuthToken } = authContext;

  const checkPermission = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!userAuthToken || !portID) {
        setIsCheckingPermission(false);
        setHasPermission(false);
        resolve(false);
      }

      setIsCheckingPermission(true);

      const url = createApiUrl("checkPermission.php");
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token: userAuthToken ?? "",
          portID,
        }).toString(),
      })
        .then((response) => response.json())
        .then((result) => {
          const { success } = result;

          const hasPermission = !!success;
          setHasPermission(hasPermission);
          setIsCheckingPermission(false);

          resolve(hasPermission);
        })
        .catch(() => {
          setIsCheckingPermission(false);
          resolve(false);
        });
    });
  };

  useEffect(() => {
    checkPermission();
  }, [userAuthToken]);

  useEffect(() => {
    if (!isCheckingPermission && !hasPermission) {
      navigate("/acessoNegado");
    }
  }, [isCheckingPermission, hasPermission, navigate]);

  return (
    <>
      {isCheckingPermission ? (
        <Loading message="Verificando permissão de acesso..." />
      ) : (
        children
      )}
    </>
  );
}

export default CheckPermission;
