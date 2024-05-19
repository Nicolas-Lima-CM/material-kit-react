import React from "react";

interface ErrorGettingDataProps {
  alert?: boolean;
  message?: string;
  marginClass?: string;
}

function ErrorGettingData({
  alert,
  message,
  marginClass,
}: ErrorGettingDataProps) {
  marginClass = marginClass ? marginClass : "";
  
  return (
    <>
      {alert ? (
        <div
          className={`alert alert-danger d-flex mx-3 mt-2 align-items-center ${marginClass}`}
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
            viewBox="0 0 16 16"
            role="img"
            aria-label={message || "Erro ao obter dados."}
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>{message || "Erro ao obter dados."}</div>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-exclamation-triangle text-danger me-2"
            viewBox="0 0 16 16"
          >
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>
          <h5 className="text-danger m-0">
            {message || "Erro ao obter dados."}
          </h5>
        </div>
      )}
    </>
  );
}

export default ErrorGettingData;
