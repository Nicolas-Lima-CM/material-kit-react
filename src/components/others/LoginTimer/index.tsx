import React, { useState, useEffect, useContext } from "react";
import { GlobalDataContext } from "../../../contexts/globalData";
import { toast } from "react-toastify";

function LoginTimer() {
  const globalDataContext = useContext(GlobalDataContext);

  if (!globalDataContext) {
    throw new Error("useContext must be used within a GlobalDataProvider");
  }

  const { setUserLoginTime, userLoginTime, setTokenHasExpired, pageLoading } =
    globalDataContext;
  const [tenMinutesWarningGiven, setTenMinutesWarningGiven] = useState(false);
  const [fiveMinutesWarningGiven, setFiveMinutesWarningGiven] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    setTimeLeft((prevState) => {
      if (prevState !== userLoginTime) {
        return userLoginTime;
      }

      return prevState;
    });

    setTenMinutesWarningGiven(false);
    setFiveMinutesWarningGiven(false);
  }, [userLoginTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleTimeUpdate();
    }, 1000); // 1000ms = 1s

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pageLoading || !(userLoginTime > 0)) {
      return;
    }

    if (timeLeft <= 0) {
      setTokenHasExpired(true);
      setUserLoginTime(0);
      return;
    }

    // Five Minutes Warning
    if (timeLeft < 300 && !fiveMinutesWarningGiven) {
      toast.dismiss("10-minute-session-expiration-warning");
      toast.warn(`Sua sessão vai expirar em menos de 5 minutos!`, {
        toastId: "5-minute-session-expiration-warning",
        autoClose: false,
      });
      setFiveMinutesWarningGiven(true);
    }

    // Ten Minutes Warning
    if (timeLeft > 300 && timeLeft < 600 && !tenMinutesWarningGiven) {
      toast.warn("Sua sessão vai expirar em menos de 10 minutos!", {
        toastId: "10-minute-session-expiration-warning",
        autoClose: false,
      });
      setTenMinutesWarningGiven(true);
    }
  }, [timeLeft, pageLoading]);

  const handleTimeUpdate = () => {
    setTimeLeft((prevRemainingTime) => {
      if (prevRemainingTime <= 0) {
        return 0;
      }

      return prevRemainingTime - 1;
    });

    if (!tenMinutesWarningGiven && timeLeft <= 600) {
      setTenMinutesWarningGiven(true);
    }
  };

  const days = Math.floor(timeLeft / (60 * 60 * 24));
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = Math.floor(timeLeft % 60);

  let hoursString = "";
  let minutesString = "";
  let secondsString = "";

  if (days > 0) {
    hoursString += `${days} d `;
  }
  if (hours > 0) {
    hoursString += `${hours} h `;
  }
  if (minutes > 0) {
    minutesString += `${minutes} m `;
  }
  if (seconds > 0) {
    secondsString += `${seconds} s`;
  }

  return (
    <>
      {timeLeft > 0 && (
        <div id="loginTimer">
          <div
            id="temporizador"
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
              fontSize: "16px",
              zIndex: 10,
            }}
            className="d-flex align-items-center text-danger"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-timeLeft"
              style={{ marginRight: "6.5px" }}
              viewBox="0 0 16 16"
            >
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
            </svg>
            <span>
              {hoursString}
              {minutesString}
              {secondsString}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginTimer;
