/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import type { ReactNode } from "react";

type NotificationContextValue = {
  permission: NotificationPermission | "unsupported";
  notify: (title: string, body: string, patientId?: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    "Notification" in window ? Notification.permission : "unsupported",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === "NAVIGATE") {
          if (event.data.patientId) {
            useAppStore.getState().selectPatient(event.data.patientId);
          }
          navigate(`/${event.data.route}`);
        }
      };
      
      navigator.serviceWorker.addEventListener("message", handleMessage);
      return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
    }
  }, [navigate]);

  const notify = useCallback(async (title: string, body: string, patientId?: string) => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    const granted =
      Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    setPermission(granted);

    if (granted !== "granted") {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: "/careops.svg",
      badge: "/careops.svg",
      tag: "careops-alert",
      data: { route: "patients", patientId },
    });
  }, []);

  const value = useMemo(() => ({ permission, notify }), [permission, notify]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const value = useContext(NotificationContext);
  if (!value) {
    throw new Error("useNotifications must be used within NotificationProvider.");
  }
  return value;
};
