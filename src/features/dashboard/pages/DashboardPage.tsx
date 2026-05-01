import {
  AlertTriangle,
  CalendarClock,
  HeartPulse,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { ChartPanel } from "../../../shared/components/ChartPanel";
import { MetricCard } from "../../../shared/components/MetricCard";

import { weeklyAdmissions } from "../../../services/patientData";
import { useAppStore } from "../../../store/useAppStore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const patients = useAppStore((state) => state.patients);
  const navigate = useNavigate();
  const selectPatient = useAppStore((state) => state.selectPatient);

  const highRiskCount = useMemo(
    () => patients.filter((patient) => patient.risk === "high").length,
    [patients],
  );

  const avgAdherence = useMemo(
    () =>
      Math.round(
        patients.reduce((total, patient) => total + patient.adherence, 0) /
          patients.length,
      ),
    [patients],
  );

  return (
    <div className="grid gap-5 grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)] animate-in">
      <section className="grid col-span-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active patients"
          value={patients.length.toLocaleString()}
          delta="+12 enrolled this week"
          tone="teal"
          icon={UsersRound}
        />
        <MetricCard
          label="High-risk patients"
          value={String(highRiskCount)}
          delta="2 require review"
          tone="coral"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Care adherence"
          value={`${avgAdherence}%`}
          delta="+4.2% vs last week"
          tone="mint"
          icon={HeartPulse}
        />
        <MetricCard
          label="Avg response time"
          value="14m"
          delta="-6m improvement"
          tone="slate"
          icon={TrendingUp}
        />
      </section>

      <ChartPanel
        title="Weekly care activity"
        caption="Admissions, follow-ups, and remote monitoring touchpoints"
        data={weeklyAdmissions}
      />

      <section className="p-5 border border-border rounded-2xl bg-white/94 shadow-soft">
        <div className="flex justify-between gap-4 mb-4.5">
          <div>
            <h2 className="m-0 text-[1.08rem]">Today's clinical agenda</h2>
            <p className="m-0 mt-1.25 text-muted text-[0.9rem]">
              Prioritized visits and follow-up windows
            </p>
          </div>
          <CalendarClock size={20} />
        </div>
        <div className="grid gap-2.5">
          {patients.slice(0, 5).map((patient) => (
            <button
              key={patient.id}
              onClick={() => {
                selectPatient(patient.id);
                navigate("/patients");
              }}
              className="grid gap-0.75 p-3.5 text-left text-text bg-surface-strong border border-border rounded-xl transition-all duration-150 ease-out hover:border-teal/34 hover:shadow-soft hover:-translate-y-px"
            >
              <span className="text-muted text-[0.8rem] font-bold">
                {patient.nextVisit}
              </span>
              <strong className="font-sans">{patient.name}</strong>
              <small className="text-muted text-[0.8rem] font-bold">
                {patient.condition}
              </small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
