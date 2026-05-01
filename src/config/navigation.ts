import {
  BarChart3,
  LayoutDashboard,
  UsersRound,
  LucideIcon
} from "lucide-react";
import type { AppRoute } from "../shared/types/types";

export const navItems: Array<{
  route: AppRoute;
  label: string;
  icon: LucideIcon;
}> = [
  { route: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { route: "analytics", label: "Analytics", icon: BarChart3 },
  { route: "patients", label: "Patients", icon: UsersRound },
];

export const pageTitle: Record<AppRoute, string> = {
  dashboard: "Home Dashboard",
  analytics: "Analytics",
  patients: "Patient Details",
};
