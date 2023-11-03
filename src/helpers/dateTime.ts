import { format, formatRelative } from "date-fns";
import { nl } from "date-fns/locale";

export const toDateTimeString = (dateTime: Date): string => {
  // Middernacht tonen we niet
  return formatRelative(dateTime, new Date(), { locale: nl }).replace("om 00:00", "");
  return format(dateTime, "dd/MM/yy HH:mm").replace("00:00", "");
};
