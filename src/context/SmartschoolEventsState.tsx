import { createContext, useContext, useState, FC, useEffect } from "react";
import ITodo from "../types/ITodo";
import { useAuth } from "./AuthState";
import axios from "axios";
import ical from "ical.js";

type SmartschoolEvents = {
  events: ITodo[];
};

export const SmartschoolEventsContext = createContext<SmartschoolEvents | undefined>(undefined);

export const SmartschoolEventsProvider: FC = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ITodo[]>([]);

  useEffect(() => {
    async function fetchSS() {
      let smartschoolEvents: ITodo[] = [];
      if (user.smartschoolCourseExport !== undefined) {
        const res = await axios(
          "https://" + process.env.REACT_APP_SMARTSCHOOL_PROXY_DOMAIN + user.smartschoolCourseExport.slice(26),
          {
            withCredentials: false,
          }
        );
        const icalString = res.data;
        const icalData = new ical.Component(ical.parse(icalString)).getAllSubcomponents("vevent");
        smartschoolEvents = smartschoolEvents.concat(
          icalData.map((component) => {
            const event = new ical.Event(component);
            return {
              id: -1,
              done: false,
              origin: "Smartschool",
              subject: event.summary,
              description: event.description,
              endTime: event.endDate.toJSDate(),
              startTime: event.startDate.toJSDate(),
            };
          })
        );
      }
      if (user.smartschoolTaskExport !== undefined) {
        const res = await axios(
          "https://" + process.env.REACT_APP_SMARTSCHOOL_PROXY_DOMAIN + user.smartschoolTaskExport.slice(26),
          {
            withCredentials: false,
          }
        );
        const icalString = res.data;
        const icalData = new ical.Component(ical.parse(icalString)).getAllSubcomponents("vevent");
        smartschoolEvents = smartschoolEvents.concat(
          icalData.map((component) => {
            const event = new ical.Event(component);
            return {
              id: -1,
              done: false,
              origin: "Smartschool",
              subject: event.summary,
              description: event.description,
              endTime: event.endDate.toJSDate(),
              startTime: event.startDate.toJSDate(),
            };
          })
        );
      }
      setEvents(smartschoolEvents);
    }
    fetchSS();
  }, [user]);

  return (
    <SmartschoolEventsContext.Provider
      value={{
        events,
      }}
    >
      {children}
    </SmartschoolEventsContext.Provider>
  );
};

export function useSmartschoolEvents(): SmartschoolEvents {
  const context = useContext(SmartschoolEventsContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
