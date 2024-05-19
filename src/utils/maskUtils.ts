import { isAFloatNumber } from "./numberUtils";
import { isACnpj } from "./formUtils";

type MaskedData<T> = {
  [K in keyof T]: string | number;
};

interface MaskFieldsProps<T> {
  data: MaskedData<T>;
  fillUndefinedOrNullWithString?: boolean;
}

export const applyMask = (value: string, mask: string) => {
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

export const maskMap = {
  cpf: "999.999.999-99",
  comissao: "99.99%",
  telefone1: "(99) 9999-9999",
  telefone2: "(99) 99999-9999",
  telefone3: "(99) 99999-9999",
  cnpj: "99.999.999/9999-99",
  cep: "99999-999",
  chavepix: "999.999.999-99",
};

export const applyMaskToField = (
  fieldValue: string,
  fieldName: string,
  pixKeyType?: string,
  currentValue?: string
) => {
  if (!fieldValue || !maskMap[fieldName as keyof typeof maskMap]) {
    return fieldValue;
  }

  let mask = maskMap[fieldName as keyof typeof maskMap];

  // If the CNPJ has 15 digits, change the CNPJ mask to 15 digits.
  if (fieldName === "cnpj") {
    if (fieldValue.length >= 15) {
      mask = "999.999.999/9999-99";
    }
  }

  // Check if the field is a percentage input, by checking his mask
  if (mask.includes("%")) {
    fieldValue = currentValue ?? "0";

    if (parseFloat(currentValue ?? "0") >= 100) {
      fieldValue = "100";
    }

    const parts = fieldValue.split(".");

    if (parts.length >= 2) {
      if (parts[0].length < 2) {
        parts[0] = parts[0].padStart(2, "0");
        fieldValue = parts.join(".");
      }
    }

    mask = "ignore";
  }

  if (pixKeyType && !mask.includes("%")) {
    switch (pixKeyType) {
      case "cpf":
        mask = maskMap.cpf;
        break;
      case "cnpj":
        mask = "99.999.999/9999-99";

        // if (maskedValue.length === 15) {
        //   mask = "999.999.999/9999-99";
        // }
        break;
      case "phone":
        mask = "+9999999999999";
        break;
      case "email":
        mask = "";
        break;
      case "random":
        mask = "99999999-9999-9999-9999-999999999999";
        break;
      default:
        mask = "";
    }
  }

  return mask && mask !== "ignore" ? applyMask(fieldValue, mask) : fieldValue;
};

export const removeMask = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

export const unmaskFields = <T extends Record<string, string>>(
  data: T
): Record<string, string> => {
  const unmaskedData: Record<string, string> = {};

  const fieldsToUnmask = [
    { name: "cep" },
    { name: "cpf" },
    { name: "telefone1" },
    { name: "telefone2" },
    { name: "telefone3" },
    { name: "cnpj" },
    { name: "chavepix" },
  ];

  for (const field of fieldsToUnmask) {
    const { name } = field;
    if (data[name]) {
      // If the field is 'chavepix' and the 'tipochave' is not email, do not remove the mask.
      if (name === "chavepix") {
        const pixKeyType = data?.tipochave;

        if (pixKeyType && pixKeyType !== "email") {
          unmaskedData[name] = removeMask(data[name]);
        }
      } else {
        unmaskedData[name] = removeMask(data[name]);
      }
    }
  }

  return unmaskedData;
};

export function maskFields<T extends Record<string, string | number>>({
  data,
  fillUndefinedOrNullWithString,
}: MaskFieldsProps<T>) {
  const maskedData = data as MaskedData<T>;

  for (const fieldName in data) {
    const fieldValue = data[fieldName] as string;

    if (fieldName in maskMap) {
      const isAFloatNumberOrCnpj =
        isAFloatNumber(fieldValue) || isACnpj(fieldValue);
      const unmaskedFieldValue = isAFloatNumberOrCnpj
        ? removeMask(fieldValue)
        : fieldValue;

      maskedData[fieldName] =
        applyMaskToField(unmaskedFieldValue, fieldName) ?? "";
    } else {
      if (
        (fillUndefinedOrNullWithString && fieldValue === undefined) ||
        fieldValue === null
      ) {
        maskedData[fieldName] = "";
      } else {
        maskedData[fieldName] = String(maskedData[fieldName]);
      }
    }
  }

  return { maskedData };
}
