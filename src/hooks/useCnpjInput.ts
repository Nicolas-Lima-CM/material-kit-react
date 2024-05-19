import { useState } from "react";
import { applyMaskToField } from "../utils/maskUtils";
import {
  UseFormSetValue,
  UseFormTrigger,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface MaskChangeEvent {
  event?: React.ChangeEvent<HTMLInputElement>;
  maskedValue?: string;
}

interface useCnpjInputPropsReturn {
  cnpjMask: string;
  handleCnpjChange: (data: MaskChangeEvent) => void;
}

interface useCnpjInputProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
}

function useCnpjInput<T extends FieldValues>({
  setValue,
  trigger,
}: useCnpjInputProps<T>): useCnpjInputPropsReturn {
  // Cnpj Mask
  const [cnpjMask, setCnpjMask] = useState("999.999.999/9999-99");

  // Handle Cnpj change
  const handleCnpjChange = ({ maskedValue }: MaskChangeEvent) => {
    maskedValue = maskedValue ?? "";
    const unmaskedCnpj = maskedValue.replace(/[^\d]/g, "");

    // Determine the mask based on the length of the CNPJ
    const newCnpjMask =
      unmaskedCnpj.length > 13 ? "999.999.999/9999-99" : "99.999.999/9999-99";

    const path = "cnpj" as Path<T>;
    setValue(
      path,
      applyMaskToField(unmaskedCnpj, "cnpj") as PathValue<T, Path<T>>
    );
    setCnpjMask(newCnpjMask);

    if (trigger) {
      trigger(path);
    }
  };

  return { cnpjMask, handleCnpjChange };
}

export default useCnpjInput;
