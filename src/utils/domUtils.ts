import { useState, useEffect } from "react";

// The useObservedClass function is a custom React hook that allows you to observe changes in a DOM element's class attribute. It takes an elementId and a className as arguments and returns a boolean indicating whether the observed element has the specified class or not.
export const useObservedClass = (
  elementId: string,
  className: string,
  onClassChange?: (accordionItemIsOpen: boolean) => void,
  checkOnlyIfDifferent?: boolean
): boolean => {
  const [hasClass, setHasClass] = useState(false);

  useEffect(() => {
    const element = document.getElementById(elementId);

    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if mutation.target is an HTMLElement
        if (mutation.target instanceof HTMLElement) {
          let elementHasClass = false;
          if (mutation.target.classList.contains(className)) {
            elementHasClass = true;
          }

          setHasClass((prevState) => {
            if (checkOnlyIfDifferent && hasClass === elementHasClass) {
              return prevState; // Does nothing if the class hasn't changed
            }

            if (onClassChange) {
              onClassChange(elementHasClass);
            }

            return elementHasClass;
          });
        }
      });
    });

    observer.observe(element, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, [elementId, className]);

  return hasClass;
};

export function getFilteredInputs(
  selector: string,
  excludedClasses?: string[]
): Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  return [...document.querySelectorAll(selector)].filter(
    (el): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement => {
      if (!excludedClasses || excludedClasses.length === 0) {
        return true; // Retorna true se não houver classes excluídas
      }
      return (
        el instanceof HTMLInputElement &&
        !excludedClasses.some((className) => el.classList.contains(className))
      );
    }
  );
}

// Close Off Canvas
export const closeOffCanvas = (offCanvasId: string) => {
  const offcanvas = document.getElementById(offCanvasId);

  if (offcanvas) {
    const offCanvasBtnClose: HTMLButtonElement | null =
      offcanvas.querySelector(".btn-close");

    if (offCanvasBtnClose) {
      offCanvasBtnClose?.click();
    }

    offcanvas.classList.remove("show");

    const offcanvasBackDrop = offcanvas.querySelector(
      ".offcanvas-backdrop"
    ) as HTMLElement;

    if (offcanvasBackDrop) {
      offcanvasBackDrop.classList.remove("show");
    }
  }
};

// Is Element
export const isElement = (instance: Document | Element | null): instance is Element =>
  typeof instance?.addEventListener === "function";
