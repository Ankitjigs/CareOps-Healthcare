import { create } from "zustand";
import { careAlerts, patients } from "../services/patientData";
import type { CareAlert, Patient, SessionUser, ViewMode } from "../shared/types/types";

type AppState = {
  user: SessionUser | null;
  patients: Patient[];
  alerts: CareAlert[];
  selectedPatientId: string;
  viewMode: ViewMode;
  searchTerm: string;
  setUser: (user: SessionUser | null) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSearchTerm: (searchTerm: string) => void;
  selectPatient: (patientId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  addAlert: (alert: CareAlert) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  patients,
  alerts: careAlerts,
  selectedPatientId: patients[0]?.id ?? "",
  viewMode: "grid",
  searchTerm: "",
  setUser: (user) => set({ user }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  selectPatient: (selectedPatientId) => set({ selectedPatientId }),
  acknowledgeAlert: (alertId) =>
    set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== alertId) })),
  clearAllAlerts: () => set({ alerts: [] }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
}));
