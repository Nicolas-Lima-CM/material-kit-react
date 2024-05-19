import React from "react";

export const normalizeIntegerInput = (
  event: React.ChangeEvent<HTMLInputElement>,
  maxLength?: number
) => {
  let value = event.target.value.trim().replace(/[^0-9]/g, ""); // Allows only digits

  // Limit input length if maxLength is provided
  if (maxLength !== undefined && value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  value = String(parseInt(value) || "0");

  return value;
};

export const normalizeStringInput = (
  event: React.ChangeEvent<HTMLInputElement>,
  maxLength?: number
) => {
  let value = event.target.value;

  // Limit input length if maxLength is provided
  if (maxLength !== undefined && value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  return value;
};

export const normalizeFloatNumberInput = (
  event: React.ChangeEvent<HTMLInputElement>,
  maxLengthBeforeDot?: number,
  maxLengthAfterDot?: number
) => {
  let { value: newValue } = event.target;

  // Modifying the regular expression to allow decimal numbers
  newValue = newValue.trim().replace(/[^0-9.]/g, ""); // Allows only digits and dots

  // To ensure there is at most one decimal point
  const parts = newValue.split(".");
  if (parts.length > 2) {
    newValue = parts[0] + "." + parts.slice(1).join("");
  }

  // Check if the value starts with a decimal point and add a leading zero
  if (newValue.startsWith(".")) {
    newValue = "0." + newValue.slice(1);
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

export const isACnpj = (text: string) => {
  const cnpjRegex = /^\d{2,3}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(text);
};
