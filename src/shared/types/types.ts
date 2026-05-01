export type AppRoute = "dashboard" | "analytics" | "patients";

export type ViewMode = "grid" | "list";

export type RiskLevel = "low" | "medium" | "high";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  careTeam: string;
  nextVisit: string;
  risk: RiskLevel;
  adherence: number;
  status: "Stable" | "Needs review" | "Critical watch";
  lastUpdated: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    oxygen: number;
  };
  clinicalSummary: {
    focusAreas: string[];
    riskNote?: string;
  };
};

export type CareAlert = {
  id: string;
  title: string;
  body: string;
  severity: RiskLevel;
  time: string;
  patientId?: string;
};
