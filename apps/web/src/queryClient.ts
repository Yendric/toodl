import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  logger: {
    // Anders wordt de console volgespammed met 401 unauthorized errors, welke worden gebruikt om te weten of de gebruiker ingelogd is
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});
