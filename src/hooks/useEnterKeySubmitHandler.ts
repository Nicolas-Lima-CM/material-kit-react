import { useEffect } from "react";

const useEnterKeySubmitHandler = (handleSubmit: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        document.activeElement instanceof HTMLInputElement
      ) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);
};

export default useEnterKeySubmitHandler;
