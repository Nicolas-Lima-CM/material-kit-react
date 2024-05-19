import { useEffect } from "react";
import { toLowercase } from "../utils/stringUtils";
import { isElement } from "../utils/domUtils";

type KeyboardShortcutProps = {
  target: HTMLElement | string | null;
  key: string;
  onKeyPressed: () => void;
};

const useKeyboardShortcut = ({
  target,
  key,
  onKeyPressed,
}: KeyboardShortcutProps) => {
  if (target === null) {
    return;
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (toLowercase(event.key) === toLowercase(key)) {
      event.preventDefault();
      onKeyPressed();
    }
  };

  useEffect(() => {
    const element =
      typeof target === "string" ? document.getElementById(target) : target;

    if (!isElement(element)) {
      throw new Error("Invalid target provided.");
    }

    element.addEventListener("keydown", onKeyDown as EventListener);
    return () => {
      element.removeEventListener("keydown", onKeyDown as EventListener);
    };
  }, []);
};

export default useKeyboardShortcut;
