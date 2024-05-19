import { z } from "zod";

export const zString = (options: {
  min?: number;
  max?: number;
  prefix: string;
}) => {
  const { min, max, prefix } = options;

  let schema = z.string();

  if (min !== undefined) {
    schema = schema.min(min, {
      message:
        min > 1
          ? `${prefix} deve ter mais de ${min} caracteres.`
          : `${prefix} deve ter mais de ${min} caractere.`,
    });
  }

  if (max !== undefined) {
    schema = schema.max(max, {
      message:
        max > 1
          ? `${prefix} deve ter no máximo ${max} caracteres.`
          : `${prefix} deve ter no máximo ${max} caractere.`,
    });
  }

  return schema;
};

export const zOptionalString = () => {
  return z.string().optional();
};

export const zCnpj = () => {
  return z.string().refine(
    (value: string) => {
      const trimmedValue = value.replace(/\D/g, "");

      return (
        (trimmedValue.length === 14 &&
          /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)) ||
        (trimmedValue.length === 15 &&
          /^\d{3}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value))
      );
    },
    { message: "CNPJ inválido." }
  );
};

export const zCpf = () => {
  return z
    .string()
    .refine((value) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value), {
      message: "CPF inválido.",
    });
};

export const zCep = () => {
  return z.string().refine((value) => /^\d{5}-\d{3}$/.test(value), {
    message: "CEP inválido.",
  });
};

export const zEmail = () => {
  return z.string().email({ message: "Insira um email válido." });
};

export const zUf = () => {
  return z
    .string()
    .min(2, { message: "A UF deve ter 2 caracteres." })
    .max(2, { message: "A UF deve ter 2 caracteres." });
};

export const zFixedPhoneNumber = () => {
  return z.string().regex(/^\(\d{2}\) \d{4}-\d{4}$/, {
    message: "Formato inválido para telefone fixo.",
  });
};

export const zOptionalCellPhoneNumber = () => {
  return z.string().refine(
    (val: string) => {
      // Remove formatting characters from the mask
      const unmaskedValue = val.replace(/\D/g, "");
      // Checks if the value is empty or matches the regex pattern
      return unmaskedValue.trim() === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(val);
    },
    {
      message: "Formato inválido para celular.",
    }
  );
};
