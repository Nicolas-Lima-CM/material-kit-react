export const formatBrazilianDate = (dateString: string): string | null => {
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Reduce 1 from the month, as January is represented by 0 in JavaScript
  const day = parseInt(dateParts[2]);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    return null;
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("pt-BR", options);

  return formattedDate;
};
