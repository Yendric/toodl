export const toDateTimeString = (dateTime: Date): string =>
  new Date(dateTime).toLocaleString([], { timeStyle: "short", dateStyle: "short" }).replaceAll("-", "/");
