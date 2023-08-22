import { format } from "date-fns";

export const toDateTimeString = (dateTime: Date): string => {
  return format(dateTime, "dd/MM/yy HH:mm");
};
