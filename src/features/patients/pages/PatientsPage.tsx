import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { RiskBadge } from "../../../shared/components/RiskBadge";
import { cn } from "../../../shared/utils/utils";
import { useAppStore } from "../../../store/useAppStore";
import { useMemo } from "react";
import type { Patient } from "../../../shared/types/types";

const PatientCard = ({
  patient,
  selected,
  onSelect,
}: {
  patient: Patient;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    className={cn(
      "grid gap-4 border border-border rounded-[14px] p-4 bg-white text-left transition-all duration-150 hover:-translate-y-px",
      selected && "border-teal ring-1 ring-inset ring-teal bg-teal/5",
    )}
    onClick={onSelect}
  >
    <div className="flex items-center gap-[10px]">
      <span className="grid place-items-center w-[34px] h-[34px] shrink-0 rounded-full bg-[#cffafe] text-teal-dark font-[900]">
        {patient.name.charAt(0)}
      </span>
      <div>
        <strong className="text-[1.05rem] text-teal-dark tracking-tight">
          {patient.name}
        </strong>
        <small className="block text-muted text-[0.78rem]">
          {patient.id} - {patient.age} yrs
        </small>
      </div>
    </div>
    <RiskBadge risk={patient.risk} />
    <dl className="grid gap-[10px] m-0">
      <div className="flex justify-between gap-3">
        <dt className="text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
          Condition
        </dt>
        <dd className="m-0 text-teal-dark text-[0.85rem] font-[760] text-right">
          {patient.condition}
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
          Care team
        </dt>
        <dd className="m-0 text-teal-dark text-[0.85rem] font-[760] text-right">
          {patient.careTeam}
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
          Adherence
        </dt>
        <dd className="m-0 text-teal-dark text-[0.85rem] font-[760] text-right">
          {patient.adherence}%
        </dd>
      </div>
    </dl>
  </button>
);

const PatientRow = ({
  patient,
  selected,
  onSelect,
}: {
  patient: Patient;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    className={cn(
      "grid grid-cols-[46px_1.1fr_1.2fr_1.1fr_120px_1.2fr_86px] items-center gap-3 min-w-[860px] w-full min-h-[62px] border border-border rounded-xl mb-[10px] p-[10px_14px] bg-white text-left transition-all duration-150 hover:-translate-y-px",
      selected && "border-teal ring-1 ring-inset ring-teal bg-teal/5",
    )}
    onClick={onSelect}
  >
    <span className="grid place-items-center w-[34px] h-[34px] shrink-0 rounded-full bg-[#cffafe] text-teal-dark font-[900]">
      {patient.name.charAt(0)}
    </span>
    <strong className="text-[1rem] text-teal-dark tracking-tight">
      {patient.name}
    </strong>
    <span className="text-teal-dark text-[0.85rem] font-[720]">
      {patient.condition}
    </span>
    <span className="text-teal-dark text-[0.85rem] font-[720]">
      {patient.careTeam}
    </span>
    <RiskBadge risk={patient.risk} />
    <span className="text-teal-dark text-[0.85rem] font-[720]">
      {patient.nextVisit}
    </span>
    <span className="text-teal-dark text-[0.85rem] font-[720]">
      {patient.adherence}%
    </span>
  </button>
);

export const PatientsPage = () => {
  const patients = useAppStore((state) => state.patients);
  const selectedPatientId = useAppStore((state) => state.selectedPatientId);
  const selectPatient = useAppStore((state) => state.selectPatient);
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const searchTerm = useAppStore((state) => state.searchTerm.toLowerCase());

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        [patient.name, patient.condition, patient.careTeam, patient.id]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm),
      ),
    [patients, searchTerm],
  );

  const selectedPatient = useMemo(
    () =>
      patients.find((patient) => patient.id === selectedPatientId) ??
      filteredPatients[0] ??
      patients[0],
    [patients, selectedPatientId, filteredPatients],
  );

  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] animate-in">
      <section className="p-5 border border-border rounded-2xl bg-white/94 shadow-soft">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4.5">
          <div>
            <h2 className="m-0 text-[1.15rem] font-[850] text-teal-dark tracking-tight">
              Patient roster
            </h2>
            <p className="m-0 mt-1.25 text-muted text-[0.9rem]">
              Switch between grid and list views while preserving selection
              state.
            </p>
          </div>

          <div
            className="inline-grid grid-cols-2 gap-1 border border-border rounded-xl p-1 bg-surface-strong"
            role="group"
            aria-label="Patient view mode"
          >
            <button
              className={cn(
                "inline-flex items-center gap-1.5 min-h-8.5 rounded-lg px-2.5 text-[0.82rem] font-[850] transition-colors",
                viewMode === "grid"
                  ? "bg-white text-teal-dark shadow-[0_6px_16px_rgba(18,57,64,0.08)]"
                  : "bg-transparent text-muted",
              )}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <Grid3X3 size={17} />
              Grid
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-1.5 min-h-8.5 rounded-lg px-2.5 text-[0.82rem] font-[850] transition-colors",
                viewMode === "list"
                  ? "bg-white text-teal-dark shadow-[0_6px_16px_rgba(18,57,64,0.08)]"
                  : "bg-transparent text-muted",
              )}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <List size={17} />
              List
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                selected={selectedPatient.id === patient.id}
                onSelect={() => selectPatient(patient.id)}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-auto">
            <div className="grid grid-cols-[46px_1.1fr_1.2fr_1.1fr_120px_1.2fr_86px] items-center gap-3 min-w-215 px-3.5 pb-2.5 text-teal text-[0.74rem] font-[850] uppercase tracking-wider">
              <span>Patient</span>
              <span>Name</span>
              <span>Condition</span>
              <span>Team</span>
              <span>Risk</span>
              <span>Next visit</span>
              <span>Adherence</span>
            </div>
            {filteredPatients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                selected={selectedPatient.id === patient.id}
                onSelect={() => selectPatient(patient.id)}
              />
            ))}
          </div>
        )}

        {!filteredPatients.length ? (
          <p className="border border-dashed border-border rounded-[14px] p-4.5 text-muted text-center">
            No patients match the current search.
          </p>
        ) : null}
      </section>

      <aside className="sticky top-26 self-start p-5 border border-border rounded-2xl bg-white/94 shadow-soft">
        <div className="flex items-center gap-3 mb-4.5">
          <span className="grid place-items-center shrink-0 rounded-full bg-[#cffafe] text-teal-dark font-[900] w-14 h-14 text-[1.4rem]">
            {selectedPatient.name.charAt(0)}
          </span>
          <div>
            <h2 className="m-0 text-[1.2rem] font-[850] text-teal-dark tracking-tight leading-[1.2]">
              {selectedPatient.name}
            </h2>
            <p className="m-0 mt-1 text-slate text-[0.9rem] font-semibold">
              {selectedPatient.id} - {selectedPatient.condition}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3.5 bg-surface-strong rounded-xl border border-border">
          <RiskBadge risk={selectedPatient.risk} />
          <strong className="text-[0.95rem] text-teal-dark">
            {selectedPatient.status}
          </strong>
          <small className="ml-auto text-muted text-[0.8rem]">
            Updated {selectedPatient.lastUpdated}
          </small>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl border border-border bg-white shadow-sm">
            <span className="block mb-1 text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
              Heart rate
            </span>
            <strong className="text-[1.15rem] text-teal-dark font-[850]">
              {selectedPatient.vitals.heartRate}{" "}
              <span className="text-[0.8rem] text-slate font-semibold">
                bpm
              </span>
            </strong>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-white shadow-sm">
            <span className="block mb-1 text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
              Blood pressure
            </span>
            <strong className="text-[1.15rem] text-teal-dark font-[850]">
              {selectedPatient.vitals.bloodPressure}
            </strong>
          </div>
          <div className="p-[14px] rounded-[12px] border border-border bg-white shadow-sm">
            <span className="block mb-1 text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
              Oxygen
            </span>
            <strong className="text-[1.15rem] text-teal-dark font-[850]">
              {selectedPatient.vitals.oxygen}%
            </strong>
          </div>
          <div className="p-[14px] rounded-[12px] border border-border bg-white shadow-sm">
            <span className="block mb-1 text-teal text-[0.72rem] font-[850] uppercase tracking-wider">
              Adherence
            </span>
            <strong className="text-[1.15rem] text-teal-dark font-[850]">
              {selectedPatient.adherence}%
            </strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center gap-4 mb-3">
            <div>
              <h3 className="m-0 text-[1.1rem] font-[850] text-teal-dark">
                Care plan
              </h3>
              <p className="m-0 mt-1 text-muted text-[0.9rem] font-[600]">
                {selectedPatient.careTeam}
              </p>
            </div>
            <SlidersHorizontal size={18} className="text-slate" />
          </div>
          <ul className="m-0 pl-[22px] text-slate text-[0.88rem] leading-[1.6]">
            <li>Review medication adherence before next appointment.</li>
            <li>Confirm remote vitals sync with assigned care coordinator.</li>
            <li>Route elevated risk changes to the specialist team.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
