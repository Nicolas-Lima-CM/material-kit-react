import { useState } from "react";

interface useDataFetchingProps<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

function useDataFetching<T>(initialState: T): useDataFetchingProps<T> {
  const [data, setData] = useState<T>(initialState);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  return { data, setData, isFetching, setIsFetching };
}

export default useDataFetching;
