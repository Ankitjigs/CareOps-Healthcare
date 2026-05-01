import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { NotificationProvider } from "./providers/NotificationProvider";
import { subscribeToSession } from "../services/firebase";
import { useAppStore } from "../store/useAppStore";

export const App = () => {
  const [booting, setBooting] = useState(true);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToSession((sessionUser) => {
      setUser(sessionUser);
      setBooting(false);
    });
    return unsubscribe;
  }, [setUser]);

  if (booting) {
    return <div className="boot-screen">Starting CareOps...</div>;
  }

  return (
    <NotificationProvider>
      {user ? <DashboardLayout /> : <LoginPage />}
    </NotificationProvider>
  );
};
