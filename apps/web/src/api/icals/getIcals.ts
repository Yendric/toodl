import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ical from "ical.js";
import { useAuth } from "../../context/AuthState";
import { useUser } from "../user/getUser";

export const useIcals = () => {
  const { data: user, isSuccess } = useUser();
  const { isLoading } = useAuth();

  return useQuery({
    queryKey: ["icals", "user"],
    queryFn: async () => {
      if (!user) return [];

      return (
        await Promise.all(
          user.icalUrls?.map(async (url) => {
            const res = await axios(url, { withCredentials: false });
            const icalString = res.data;
            const icalData = new ical.Component(ical.parse(icalString)).getAllSubcomponents("vevent");
            return icalData.map((component) => {
              const event = new ical.Event(component);
              return {
                id: -1,
                done: false,
                origin: "iCal",
                subject: event.summary,
                description: event.description,
                endTime: event.endDate.toJSDate(),
                startTime: event.startDate.toJSDate(),
              };
            });
          }) ?? [],
        )
      ).flat();
    },
    enabled: isSuccess && !isLoading,
  });
};
