import React from "react";

function Loading({
  message = "Carregando...",
  paddingClass = "p-4",
  textClass = "text-dark",
}: {
  message?: string;
  paddingClass?: string;
  textClass?: string;
}) {
  return (
    <div className={`d-flex align-items-center ${paddingClass} ${textClass}`}>
      <div className="spinner-border" role="status"></div>
      <span className="ms-2">{message}</span>
    </div>
  );
}

export default Loading;
