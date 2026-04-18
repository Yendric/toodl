/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

// Take control of all pages immediately
void self.skipWaiting();
clientsClaim();

// Cleanup old caches and precache all assets
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

export interface PushPayload {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
}

// Handle Push notifications
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  try {
    const payload = event.data.json() as PushPayload;
    const title = payload.title ?? "Toodl";

    const options: NotificationOptions = {
      body: payload.body,
      icon: "/logo192.png",
      badge: "/favicon.ico",
      data: payload,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("Error displaying push notification:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const payload = event.notification.data as PushPayload;
  const urlToOpen = (payload?.data?.url as string) || "/todos";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        // If a window is already open, focus it
        for (const client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      }),
  );
});
