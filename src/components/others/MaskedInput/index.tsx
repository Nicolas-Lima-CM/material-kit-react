import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type MaskedInputProps = {
  mask: string;
  name: string;
  maxValue?: number;
  formSubmitted?: boolean;
  setInputValue?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: UseFormTrigger<any>;
  onChange?: ({
    event,
    maskedValue,
    valueWithoutMask,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    maskedValue: string;
    valueWithoutMask: string;
  }) => void; // Adicione esta linha
} & React.InputHTMLAttributes<HTMLInputElement>;

function MaskedInput({
  mask,
  name,
  register,
  onChange,
  setValue,
  trigger,
  formSubmitted,
  setInputValue = true,
  maxValue,
  ...rest
}: MaskedInputProps) {
  const applyMask = (value: string) => {
    if (!value || !mask) return value;
    let masked = "";
    let i = 0;
    for (const m of mask) {
      if (m === "9" && value[i]) {
        masked += value[i++];
      } else if (value[i]) {
        masked += m;
      }
    }
    return masked;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedInputValue = e.target.value.replace(/\D/g, "");

    const maskedValue = mask ? applyMask(formattedInputValue) : inputValue;

    // Check if the field is a percentage input and if the value exceeds 100%
    // if (isAPorcentageInput && formattedInputValue.slice(0, 3) === "100") {
    //   // Limit the value to 100%
    //   maskedValue = "100";
    // }

    // Check if the input value exceeds the maximum allowed value
    if (maxValue && parseFloat(maskedValue) > maxValue) {
      // Handle the case where the input exceeds the maximum value
      // For example, you can set the input value to the maximum allowed value
      setValue(name, applyMask(maxValue.toString()));
      return;
    }

    const inputElem = document.querySelector(
      `[name=${name}]`
    ) as HTMLInputElement;

    e.target.value = maskedValue;

    if (inputElem) inputElem.value = maskedValue;

    if (onChange) {
      onChange({
        event: e,
        maskedValue,
        valueWithoutMask: formattedInputValue,
      });
    }

    if (setInputValue) {
      setValue(name, maskedValue);

      if (trigger && formSubmitted) {
        trigger(name);
      }
    }
  };

  return (
    <input
      {...rest}
      {...register(name, {
        onChange: handleChange,
      })}
    />
  );
}

export default MaskedInput;
