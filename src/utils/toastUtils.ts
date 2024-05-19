import { toast } from "react-toastify";

export const dismissSessionExpirationWarnings = () => {
  toast.dismiss("10-minute-session-expiration-warning");
  toast.dismiss("5-minute-session-expiration-warning");
};
