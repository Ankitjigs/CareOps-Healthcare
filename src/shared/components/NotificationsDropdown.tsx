import {
  Activity,
  Bell,
  BrainCircuit,
  CheckCheck,
  HeartPulse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../app/providers/NotificationProvider";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../utils/utils";

export const NotificationsDropdown = () => {
  const alerts = useAppStore((state) => state.alerts);
  const { notify } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      <button
        className={cn("icon-action", notificationsOpen && "active")}
        aria-label="Toggle notifications"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      >
        <Bell size={20} />
        {alerts.length > 0 && (
          <span className="t-badge" data-open="true">
            <span className="t-badge-dot">{alerts.length}</span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 flex max-h-[520px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-teal/10 bg-white/98 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[0_24px_60px_rgba(15,47,58,0.18),inset_0_0_0_1px_rgba(255,255,255,0.5)] top-[calc(100%+12px)] right-0 max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-[72px] max-sm:w-auto max-sm:max-w-none"
          >
            <div className="border-b border-border bg-gradient-to-b from-[#f8feff]/80 to-white/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="m-0 flex items-center gap-2 text-base font-black text-text">
                  Care Alerts
                  <span className="rounded-full border border-border bg-surface-strong px-2 py-0.5 text-[0.7rem] font-[850] text-teal-dark">{alerts.length}</span>
                </h3>
                <button
                  className="text-teal hover:underline flex items-center gap-1.5"
                  onClick={() => {
                    useAppStore.getState().clearAllAlerts();
                    notify("All clear", "All alerts marked as read");
                    setNotificationsOpen(false);
                  }}
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-1.5 text-[0.78rem] font-[800] text-slate transition-all duration-200 hover:text-teal"
                  onClick={() => {
                    const newAlert = {
                      id: `sim-${Date.now()}`,
                      title: "Respiratory Distress",
                      body: "Sara Thomas has oxygen saturation below 88%. Immediate review required.",
                      time: "Just now",
                      severity: "high" as const,
                      patientId: "PT-1301",
                    };
                    useAppStore.getState().addAlert(newAlert);
                    notify(newAlert.title, newAlert.body, newAlert.patientId);
                  }}
                >
                  <Bell size={13} />
                  Simulate new alert
                </button>
              </div>
            </div>

            <div className="custom-scrollbar flex flex-col gap-1 overflow-y-auto p-2">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="group relative flex cursor-pointer gap-3 rounded-xl border border-transparent p-3 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-x-1 hover:border-teal/20 hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(22,78,99,0.06)]"
                    onClick={() => {
                      if (alert.patientId) {
                        useAppStore.getState().selectPatient(alert.patientId);
                        navigate("/patients");
                        setNotificationsOpen(false);
                      }
                    }}
                  >
                    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-[10px] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]", alert.severity === "high" ? "bg-[#fff0ee] text-coral" : alert.severity === "medium" ? "bg-[#fef3c7] text-amber" : "bg-mint text-green")}>
                      {alert.severity === "high" ? (
                        <HeartPulse size={16} />
                      ) : alert.severity === "medium" ? (
                        <BrainCircuit size={16} />
                      ) : (
                        <Activity size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="mb-0.5 block text-[0.88rem] font-[800] text-text transition-colors duration-200 group-hover:text-teal">{alert.title}</span>
                      <span className="block text-[0.8rem] leading-[1.4] text-muted">{alert.body}</span>
                      <span className="mt-1.5 block text-[0.72rem] font-[600] text-muted">{alert.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-muted">
                  <Bell size={32} className="mx-auto opacity-20" />
                  <p className="mt-3 text-[0.88rem]">No active care alerts</p>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-[#f8feff]/50 p-3.5 text-center">
              <button 
                onClick={() => setNotificationsOpen(false)}
                className="rounded-lg border-0 bg-transparent px-3 py-1.5 text-[0.82rem] font-[850] text-teal transition-all duration-200 hover:-translate-y-[1px] hover:bg-teal/10"
              >
                View clinical history
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
