export const filterDifferentValues = <T>({
  data,
  initialData,
}: {
  data: T;
  initialData: T;
}): Partial<T> => {
  const validData: Partial<T> = {};
  for (const key in data) {
    if (String(data[key]) !== String(initialData[key]) && !!data[key]) {
      validData[key] = data[key];
    }
  }
  return validData;
};
