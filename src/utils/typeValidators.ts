/** Check if a value is an object */
export const isObject = (value: unknown): value is object =>
  typeof value === "object" && !Array.isArray(value);

/** Check if a value is an array */
export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);
