import { useContext } from "react";
import { GlobalDataContext } from "../contexts/globalData";

const useGlobalDataContext = () => {
  const context = useContext(GlobalDataContext);

  if (!context) {
    throw new Error("useContext must be used within a GlobalDataProvider");
  }

  return context;
};

export default useGlobalDataContext;
