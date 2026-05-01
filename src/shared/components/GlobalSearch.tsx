import { Search, UsersRound, X } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../utils/utils";

export const GlobalSearch = () => {
  const searchTerm = useAppStore((state) => state.searchTerm);
  const setSearchTerm = useAppStore((state) => state.setSearchTerm);
  const patients = useAppStore((state) => state.patients);
  const navigate = useNavigate();

  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const lowerSearch = searchTerm.toLowerCase();

  const searchResults = useMemo(
    () =>
      searchTerm.trim().length > 0
        ? patients.filter((p) =>
            [p.name, p.condition, p.careTeam, p.id]
              .join(" ")
              .toLowerCase()
              .includes(lowerSearch),
          )
        : [],
    [searchTerm, patients, lowerSearch],
  );

  const matchedTeams = useMemo(
    () =>
      searchTerm.trim().length > 0
        ? [
            ...new Set(
              patients
                .filter((p) => p.careTeam.toLowerCase().includes(lowerSearch))
                .map((p) => p.careTeam),
            ),
          ]
        : [],
    [searchTerm, patients, lowerSearch],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (patientId: string) => {
    useAppStore.getState().selectPatient(patientId);
    navigate("/patients");
    setSearchTerm("");
    setSearchFocused(false);
  };

  const handleSelectTeam = (team: string) => {
    setSearchTerm(team);
    navigate("/patients");
    setSearchFocused(false);
  };

  return (
    <div
      className="relative w-full md:w-85 lg:w-full order-last md:order-none mt-2 md:mt-0"
      ref={searchRef}
    >
      <label className="flex items-center gap-2.5 h-11 border border-border rounded-xl px-3.5 bg-surface-strong text-text font-medium transition-all duration-200 focus-within:border-teal/35 focus-within:bg-white focus-within:shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Search size={17} className="text-muted" />
        <input
          type="search"
          className="flex-1 bg-transparent border-0 border-transparent text-[0.92rem] text-text font-semibold outline-hidden focus:outline-hidden focus:ring-0 focus:border-transparent shadow-none focus:shadow-none [&::-webkit-search-cancel-button]:appearance-none"
          style={{
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
          }}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search patients, teams, alerts"
        />
        {searchTerm && (
          <button
            className="flex items-center justify-center w-6 h-6 p-0 border-none rounded-full bg-slate/10 text-muted transition-colors hover:bg-slate/20 hover:text-slate"
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSearchFocused(false);
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </label>

      {searchFocused && searchTerm.trim().length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[calc(100vw-32px)] md:w-105 max-h-[55dvh] md:max-h-115 overflow-y-auto p-2 border border-border rounded-2xl bg-white/95 shadow-main backdrop-blur-xl">
          {matchedTeams.length > 0 && (
            <div className="grid gap-1 mb-3 last:mb-0">
              <span className="block px-3 py-1.5 text-muted text-[0.72rem] font-[850] tracking-wider uppercase">
                Teams
              </span>
              {matchedTeams.map((team) => (
                <button
                  key={team}
                  className="flex items-center gap-3.5 w-full p-2.5 rounded-xl border border-transparent bg-transparent text-left transition-all duration-150 hover:bg-bg/60 hover:border-border"
                  onClick={() => handleSelectTeam(team)}
                >
                  <UsersRound size={15} />
                  <span>{team}</span>
                </button>
              ))}
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="grid gap-1 mb-3 last:mb-0">
              <span className="block px-3 py-1.5 text-muted text-[0.72rem] font-[850] tracking-wider uppercase">
                Patients
              </span>
              {searchResults.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  className="flex items-center gap-3.5 w-full p-2.5 rounded-xl border border-transparent bg-transparent text-left transition-all duration-150 hover:bg-bg/60 hover:border-border"
                  onClick={() => handleSelectPatient(p.id)}
                >
                  <span className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-surface-strong border border-border text-teal text-[0.95rem] font-bold">
                    {p.name.charAt(0)}
                  </span>
                  <div className="flex flex-col flex-1">
                    <strong className="text-[0.95rem] text-text leading-[1.3]">
                      {p.name}
                    </strong>
                    <small className="text-[0.8rem] text-muted">
                      {p.condition} · {p.careTeam}
                    </small>
                  </div>
                  <span className={cn("risk-badge mini", p.risk)}>
                    {p.risk}
                  </span>
                </button>
              ))}
            </div>
          )}
          {matchedTeams.length === 0 && searchResults.length === 0 && (
            <div className="p-5 text-center text-muted text-[0.9rem]">
              No results found for &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
};
