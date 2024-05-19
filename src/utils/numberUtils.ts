export const containsOnlyDigits = (text: string) => {
  return !/\D/.test(text);
};

export const isAFloatNumber = (text: string) => {
  const floatRegex = /^\d+(\.\d{1,2})?$/;
  return floatRegex.test(text);
};

export const isNotZero = (value: string | number) => {
  return value !== 0 && value !== "0";
};

export const isNumberGreaterThanZero = (
  value: string | number | undefined | null
): boolean => {
  // Convert the value to a number
  const numValue = Number(value);

  // Checks if the value is a number and if it is greater than zero
  return typeof numValue === "number" && numValue > 0;
};

export const handleIncrementDecrementInput = (
  event:
    | React.KeyboardEvent<HTMLInputElement>
    | React.WheelEvent<HTMLInputElement>,
  step?: number
) => {
  if (event.type === "keydown") {
    if (
      (event as React.KeyboardEvent).key === "ArrowUp" ||
      (event as React.KeyboardEvent).key === "ArrowDown"
    ) {
      event.preventDefault(); // Prevents the page from scrolling when using the up/down arrows
      const input = event.target as HTMLInputElement;
      if (step === undefined) {
        step = 1; // Set default increment/decrement value if none provided
      }
      if ((event as React.KeyboardEvent).key === "ArrowDown") {
        step *= -1; // Set the step value negative for decrement
      }
      input.value = String(parseFloat(input.value || "0") + step);
    }
  } else if (event.type === "wheel") {
    const input = event.target as HTMLInputElement;
    if (step === undefined) {
      step = (event as React.WheelEvent).deltaY > 0 ? -1 : 1; // Change this value as per your requirement
    }
    input.value = String(parseFloat(input.value || "0") + step);
  }
};

export const formatAsPercentage = (value: string) => {
  let formattedValue = parseFloat(value);

  if (isNaN(formattedValue)) {
    formattedValue = 0;
  }

  if (formattedValue < 1 && formattedValue > 0) {
    formattedValue = formattedValue * 100;
  }

  return formattedValue + "%";
};

export const formatAsCurrency = (value: number) => {
  if (isNaN(value)) {
    return "R$ 0,00";
  }

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return formattedValue;
};

export const formatAsAmount = (value: number) => {
  if (isNaN(value)) {
    return "0,00";
  }

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  const valueWithoutCurrencySymbol = formattedValue.replace("R$", "").trim();

  return valueWithoutCurrencySymbol;
};

export const normalizeNumber = (
  newValue: string,
  maxLengthBeforeDot?: number,
  maxLengthAfterDot?: number
): string => {
  // Modifying the regular expression to allow decimal numbers
  newValue = newValue.trim().replace(/[^0-9.]/g, ""); // Allows only digits and dots

  // To ensure there is at most one decimal point
  const parts = newValue.split(".");
  if (parts.length > 2) {
    newValue = parts[0] + "." + parts.slice(1).join("");
  }

  // Check the length before and after the decimal point
  if (maxLengthBeforeDot && parts[0].length > maxLengthBeforeDot) {
    newValue =
      newValue.slice(0, maxLengthBeforeDot) +
      "." +
      newValue.slice(maxLengthBeforeDot, maxLengthAfterDot);
  }

  if (maxLengthAfterDot && parts[1] && parts[1].length > maxLengthAfterDot) {
    newValue = parts[0] + "." + parts[1].slice(0, maxLengthAfterDot);
  }

  return String(newValue);
};

export const toFloat = (value: string): number => {
  const formatted = parseFloat(value);
  return formatted;
};

export const toFloatOr0 = (value: string): number => {
  const formatted = parseFloat(value);

  if (isNaN(formatted)) {
    return 0;
  }

  return formatted;
};

export const toInt = (value: string): number => {
  const formatted = parseInt(value);
  return formatted;
};

export const toIntOr0 = (value: string): number => {
  const formatted = parseInt(value);

  if (isNaN(formatted)) {
    return 0;
  }

  return formatted;
};
