import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState, type FC } from "react";
import {
  useNotificationGetVapidPublicKey,
  useNotificationSubscribe,
  useNotificationUnsubscribe,
} from "../../api/generated/toodl";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NotificationManager: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const vapidPublicKeyQuery = useNotificationGetVapidPublicKey();
  const subscribeMutation = useNotificationSubscribe();
  const unsubscribeMutation = useNotificationUnsubscribe();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      void checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        enqueueSnackbar("Service worker niet gevonden. Probeer de pagina te vernieuwen.", { variant: "error" });
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        enqueueSnackbar("Notificatie toestemming geweigerd", { variant: "error" });
        return;
      }

      const vapidData = vapidPublicKeyQuery.data;
      if (!vapidData?.publicKey) {
        enqueueSnackbar("VAPID sleutel niet gevonden", { variant: "error" });
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
      });

      const p256dh = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!)));
      const auth = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!)));

      await subscribeMutation.mutateAsync({
        data: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh,
            auth,
          },
        },
      });

      setIsSubscribed(true);
      enqueueSnackbar("Notificaties ingeschakeld op dit apparaat", { variant: "success" });
    } catch (error) {
      console.error("Subscription error:", error);
      enqueueSnackbar("Inschakelen notificaties mislukt", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = registration ? await registration.pushManager.getSubscription() : null;
      if (subscription) {
        await unsubscribeMutation.mutateAsync({
          data: {
            endpoint: subscription.endpoint,
          },
        });
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      enqueueSnackbar("Notificaties uitgeschakeld op dit apparaat", { variant: "success" });
    } catch (error) {
      console.error("Unsubscription error:", error);
      enqueueSnackbar("Uitschakelen notificaties mislukt", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Typography variant="body2" color="text.secondary">
        Push-notificaties worden niet ondersteund door uw browser.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {isSubscribed ? (
        <Button variant="outlined" color="error" onClick={() => void unsubscribe()} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Notificaties uitschakelen op dit apparaat"}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => void subscribe()}
          disabled={loading || !vapidPublicKeyQuery.data?.publicKey}
        >
          {loading ? <CircularProgress size={24} /> : "Notificaties inschakelen op dit apparaat"}
        </Button>
      )}
    </Box>
  );
};

export default NotificationManager;
