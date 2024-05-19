import { getFilteredInputs } from "./domUtils";

interface ProductData {
  codProd: string;
  codBarra: string;
  codigoCintaModerna: string;
  codigoIntermediario: string;
  codigoVerificador: string;
  descricao: string;
  altura: number | string;
  largura: number | string;
  comprimen: number | string;
  peso: number | string;
  [key: string]: string | number;
}

export const findLongestCodBarra = (productsData: ProductData[] | null) => {
  if (!productsData || productsData.length === 0) {
    return "";
  }

  let longestCodBarra = productsData[0].codigoIntermediario ?? "";
  let maxLength = longestCodBarra.length;

  productsData.forEach((product: ProductData) => {
    const currentCodBarra = product.codigoIntermediario ?? "";
    const currentLength = currentCodBarra.length;
    if (currentLength > maxLength) {
      longestCodBarra = currentCodBarra;
      maxLength = currentLength;
    }
  });

  return longestCodBarra;
};

// Function to calculate the check digit for EAN-13
export const calculateEan13CheckDigit = (ean12: string): string => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(ean12[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const remainder = sum % 10;
  return String(remainder === 0 ? 0 : 10 - remainder);
};

// Function to validate and check bar codes
export const validateAndCheckBarCodes = (
  productsData: ProductData[] | null
) => {
  const barCodes = (productsData ?? []).map((product) => {
    const { codigoCintaModerna, codigoIntermediario, codigoVerificador } =
      product;

    const codBarra = `${codigoCintaModerna}${codigoIntermediario}${codigoVerificador}`;
    return codBarra;
  });

  const duplicates = barCodes.filter(
    (code, index) => barCodes.indexOf(code) !== index
  );

  const invalidBarCodes = barCodes.filter((code) => code.length < 13);

  return {
    hasDuplicateBarCodes: duplicates.length > 0,
    hasAInvalidBarCode: invalidBarCodes.length > 0,
    invalidBarCodes,
    duplicates,
  };
};

export const applyInvalidCodBarStyling = (
  productsData: ProductData[] | null
) => {
  // Check if there are duplicate bar codes and invalid bar codes
  const { duplicates } = validateAndCheckBarCodes(productsData);

  // Get all containers with class 'codBarra-container'
  const codBarraContainers = document.querySelectorAll(".codBarra-container");

  // Iterate through each container
  codBarraContainers.forEach((container) => {
    // Find the input element with class 'codBarra' inside the container
    const codBarraInput = container.querySelector(
      "input.codBarra"
    ) as HTMLInputElement;

    // Get the value of the codBarraInput or an empty string if it's null
    const codBarraInputValue = codBarraInput?.value ?? "";

    // Filter duplicates based on the 'código intermediário'
    const matchingDuplicates = duplicates.filter(
      (duplicate) =>
        duplicate.slice(7, 12) === codBarraInputValue &&
        codBarraInputValue?.length > 0
    );

    // Apply or remove the 'invalid-cod-barra' class based on whether duplicates were found
    if (matchingDuplicates.length > 0) {
      container.classList.add("invalid-cod-barra");
    } else {
      container.classList.remove("invalid-cod-barra");
    }
  });
};

export const applyInvalidVariationTabInputsStyling = () => {
  const variationTabInputs = getFilteredInputs(
    "#variations input.peso, input.altura, input.comprimen, input.largura"
  );

  variationTabInputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("invalid-variation-input");
    } else {
      input.classList.remove("invalid-variation-input");
    }
  });
};
