import { JSX, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Download,
  Filter,
  HeartPulse,
  TrendingUp,
  ChevronDown,
  Check,
  Users,
} from "lucide-react";
import { ChartPanel } from "../../../shared/components/ChartPanel";
import { MetricCard } from "../../../shared/components/MetricCard";
import { riskTrend, weeklyAdmissions } from "../../../services/patientData";
import { useAppStore } from "../../../store/useAppStore";
import { cn } from "../../../shared/utils/utils";
import type { RiskLevel } from "../../../shared/types/types";

export const AnalyticsPage = () => {
  const allPatients = useAppStore((state) => state.patients);
  const [activeCohort, setActiveCohort] = useState<RiskLevel | "all">("all");
  const [showCohortMenu, setShowCohortMenu] = useState(false);

  const filteredPatients = useMemo(
    () =>
      activeCohort === "all"
        ? allPatients
        : allPatients.filter((p) => p.risk === activeCohort),
    [activeCohort, allPatients],
  );

  const riskMix = useMemo(
    () => ({
      low: filteredPatients.filter((patient) => patient.risk === "low").length,
      medium: filteredPatients.filter((patient) => patient.risk === "medium")
        .length,
      high: filteredPatients.filter((patient) => patient.risk === "high")
        .length,
    }),
    [filteredPatients],
  );

  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Age",
      "Condition",
      "Risk",
      "Adherence",
      "Status",
    ];
    const rows = filteredPatients.map((p) => [
      p.id,
      p.name,
      p.age,
      p.condition,
      p.risk,
      `${p.adherence}%`,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `careops_analytics_${activeCohort}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cohorts: {
    label: string;
    value: RiskLevel | "all";
    icon: JSX.Element;
    desc: string;
  }[] = [
    {
      label: "All Patients",
      value: "all",
      icon: <Users size={14} />,
      desc: "Full population overview",
    },
    {
      label: "High Risk",
      value: "high",
      icon: <TrendingUp size={14} className="text-coral" />,
      desc: "Critical care required",
    },
    {
      label: "Medium Risk",
      value: "medium",
      icon: <Activity size={14} className="text-amber" />,
      desc: "Requires monitoring",
    },
    {
      label: "Low Risk",
      value: "low",
      icon: <HeartPulse size={14} className="text-green" />,
      desc: "Stable health signals",
    },
  ];

  return (
    <div className="grid gap-5 animate-in">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4.5 border border-border rounded-2xl p-[18px_20px] bg-white shadow-soft"
      >
        <div>
          <span className="m-0 mb-0.75 text-teal text-[0.76rem] font-[850] uppercase">
            B2B Healthcare SaaS
          </span>
          <h2 className="m-0 text-[1.08rem]">Population health analytics</h2>
          <p className="m-0 mt-1.25 text-muted text-[0.9rem]">
            Showing {filteredPatients.length} of {allPatients.length} patients
            in <span className="text-teal font-bold">{activeCohort}</span>{" "}
            cohort.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              className={cn(
                "inline-flex items-center justify-center gap-2 min-h-10.5 px-3.5 border border-border rounded-[10px] bg-white text-slate text-[0.88rem] font-extrabold whitespace-nowrap transition-all duration-150 hover:border-teal/35 hover:text-teal-dark hover:shadow-soft hover:-translate-y-px",
                showCohortMenu && "border-teal shadow-sm",
              )}
              onClick={() => setShowCohortMenu(!showCohortMenu)}
            >
              <Filter size={16} />
              {cohorts.find((c) => c.value === activeCohort)?.label}
              <ChevronDown
                size={14}
                className={cn(
                  "ml-1 transition-transform duration-300",
                  showCohortMenu && "rotate-180",
                )}
              />
            </button>

            {showCohortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCohortMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-3 w-72 p-2 bg-white/94 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.5)] z-20"
                >
                  <div className="px-3 py-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                      Select Cohort
                    </span>
                  </div>
                  {cohorts.map((cohort) => (
                    <button
                      key={cohort.value}
                      className={cn(
                        "flex items-center gap-3 p-[10px_14px] rounded-[10px] text-[0.88rem] font-bold text-slate transition-all duration-200 hover:translate-x-1 w-full",
                        activeCohort === cohort.value && "bg-teal/10 text-teal",
                      )}
                      onClick={() => {
                        setActiveCohort(cohort.value);
                        setShowCohortMenu(false);
                      }}
                    >
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-surface-strong text-muted">
                        {cohort.icon}
                      </span>
                      <div className="text-left">
                        <div className="block">{cohort.label}</div>
                        <div className="text-[10px] text-muted font-medium opacity-80">
                          {cohort.desc}
                        </div>
                      </div>
                      <Check
                        size={14}
                        className={cn(
                          "ml-auto",
                          activeCohort === cohort.value
                            ? "opacity-100 text-teal"
                            : "opacity-0",
                        )}
                      />
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 min-h-10.5 px-3.5 border border-border rounded-[10px] bg-white text-slate text-[0.88rem] font-extrabold transition-all duration-150 hover:border-teal/35 hover:text-teal-dark hover:shadow-soft hover:-translate-y-px"
            onClick={handleExport}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="grid col-span-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <MetricCard
            label="Risk model score"
            value={activeCohort === "high" ? "92.1" : "87.4"}
            delta="+3.1 accuracy"
            tone="teal"
            icon={BrainCircuit}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
        >
          <MetricCard
            label="Readmission risk"
            value={activeCohort === "high" ? "24.5%" : "12.8%"}
            delta="-1.9% from baseline"
            tone="mint"
            icon={TrendingUp}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.29 }}
        >
          <MetricCard
            label="Remote vitals"
            value={
              activeCohort === "all"
                ? "3,914"
                : filteredPatients.length * 420 + ""
            }
            delta="92% device uptime"
            tone="slate"
            icon={Activity}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
        >
          <MetricCard
            label="Escalations"
            value={activeCohort === "high" ? "12" : "18"}
            delta="6 open reviews"
            tone="coral"
            icon={HeartPulse}
          />
        </motion.div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <ChartPanel
            title="Care touchpoint volume"
            caption="Daily engagement across remote and in-person workflows"
            data={weeklyAdmissions}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32 }}
        >
          <ChartPanel
            title="High-risk trend"
            caption="Patients crossing review thresholds over seven days"
            data={riskTrend}
            color="linear-gradient(to top, #dc5f4f, #e8887d)"
          />
        </motion.div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="p-5 border border-border rounded-2xl bg-white/94 shadow-soft"
      >
        <div className="flex justify-between items-start gap-4 mb-4.5">
          <div>
            <h2 className="m-0 text-[1.08rem]">Risk distribution</h2>
            <p className="m-0 mt-1.25 text-muted text-[0.9rem]">
              Current monitored population by care risk
            </p>
          </div>
        </div>
        <div className="grid gap-3.5 animate-in">
          {Object.entries(riskMix).map(([risk, count], index) => (
            <div
              key={risk}
              className={cn(
                "grid grid-cols-[90px_42px_minmax(0,1fr)] items-center gap-3 capitalize",
                count === 0 && "opacity-40",
              )}
            >
              <span className="text-muted text-[0.78rem] font-[750] uppercase">
                {risk}
              </span>
              <strong className="text-[0.95rem]">{count}</strong>
              <div className="risk-bar-bg relative h-2 flex-1 rounded-full bg-surface-strong overflow-hidden">
                <motion.i
                  initial={{ width: 0 }}
                  animate={{
                    width: `${filteredPatients.length > 0 ? (count / filteredPatients.length) * 100 : 0}%`,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    risk === "high"
                      ? "bg-coral"
                      : risk === "medium"
                        ? "bg-amber"
                        : "bg-green",
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
