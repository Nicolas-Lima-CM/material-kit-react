import { MutableRefObject } from "react";

// eslint-disable-next-line
export const setRefValueToNull = (ref: MutableRefObject<any | null>) => {
  if (ref.current && typeof ref.current.setValue === "function") {
    ref.current.setValue(null);
  }
};
