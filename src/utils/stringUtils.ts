export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeAndLowercase(str: string): string {
  return removeAccents(str.trim().toLocaleLowerCase());
}

export function toLowercase(str: string): string {
  return str.toLocaleLowerCase();
}

export function capitalizeFirstLetter(str: string): string {
  // Get the first letter and convert it to uppercase
  const firstLetter = str.charAt(0).toUpperCase();

  // Get the rest of the string
  const restOfString = str.slice(1);

  // Concatenates the first capital letter with the rest of the string
  return firstLetter + restOfString;
}

export const isEmpty = (str: string): boolean => {
  return str.trim().length === 0;
};
